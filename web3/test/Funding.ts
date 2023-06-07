import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { Funding } from "../typechain-types";
import { expect } from "chai";
import { parseUnits } from "ethers/lib/utils";
import { latest } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";

describe("Funding", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFunding() {
        // Contracts are deployed using the first signer/account by default
        const [owner, user] = await ethers.getSigners();

        // deploy erc20 token for raise
        const Token = await ethers.getContractFactory("ERC20Mock");
        const raiseToken = await Token.deploy("USDC Mock Token", "USDC", 18);

        const equityToken = await Token.deploy("Equity Token", "EQT", 18);

        const FundingFactory = await ethers.getContractFactory("Funding");
        const funding = (await FundingFactory.deploy(
            raiseToken.address
        )) as Funding;

        return { funding, owner, user, raiseToken, equityToken };
    }

    async function createProject() {
        const { funding, user, raiseToken, equityToken } = await loadFixture(
            deployFunding
        );

        await equityToken.mint(user.address, parseUnits("100", 18));
        await equityToken
            .connect(user)
            .approve(funding.address, parseUnits("100", 18));

        await funding
            .connect(user)
            .createProject(
                "test",
                "test",
                parseUnits("100", 18),
                equityToken.address,
                parseUnits("100", 18),
                (await latest()) + time.duration.hours(1),
                (await latest()) + time.duration.hours(2)
            );

        return { funding, user, raiseToken, equityToken };
    }

    describe("Deployment", function () {
        it("Should set the right raiseToken", async function () {
            const { funding, raiseToken } = await loadFixture(deployFunding);

            expect(await funding.raiseToken()).to.equal(raiseToken.address);
        });
    });

    describe("create project", function () {
        it("fails if the creator didn't set proper allowance", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(deployFunding);

            await expect(
                funding
                    .connect(user)
                    .createProject(
                        "test",
                        "test",
                        parseUnits("100", 18),
                        equityToken.address,
                        parseUnits("100", 18),
                        (await latest()) + time.duration.hours(1),
                        (await latest()) + time.duration.hours(2)
                    )
            ).to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("fails if the creator doesn't have enough equity tokens", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(deployFunding);

            await equityToken
                .connect(user)
                .approve(funding.address, parseUnits("100", 18));

            await expect(
                funding
                    .connect(user)
                    .createProject(
                        "test",
                        "test",
                        parseUnits("100", 18),
                        equityToken.address,
                        parseUnits("100", 18),
                        (await latest()) + time.duration.hours(1),
                        (await latest()) + time.duration.hours(2)
                    )
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("creates the project", async function () {
            const { funding, user, equityToken } = await loadFixture(
                deployFunding
            );

            await equityToken.mint(user.address, parseUnits("100", 18));
            await equityToken
                .connect(user)
                .approve(funding.address, parseUnits("100", 18));

            await expect(
                funding
                    .connect(user)
                    .createProject(
                        "test",
                        "test",
                        parseUnits("100", 18),
                        equityToken.address,
                        parseUnits("100", 18),
                        (await latest()) + time.duration.hours(1),
                        (await latest()) + time.duration.hours(2)
                    )
            ).to.not.be.reverted;

            const project = await funding.projects(0);
            expect(project.id).to.equal(0);
            expect(project.title).to.equal("test");
            expect(project.description).to.equal("test");
            expect(project.targetRaiseAmount).to.equal(parseUnits("100", 18));
            expect(project.equityToken).to.equal(equityToken.address);
            expect(project.equityAmount).to.equal(parseUnits("100", 18));
        });
    });

    describe("contribute", function () {
        it("reverts if raise period is not active", async function () {
            const { funding, user } = await loadFixture(createProject);

            await expect(
                funding.connect(user).contribute(0, parseUnits("10", 18))
            ).to.be.revertedWith("Cannot contribute before start time");
        });

        it("reverts if raise period is over", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(3));

            await expect(
                funding.connect(user).contribute(0, parseUnits("10", 18))
            ).to.be.revertedWith("Cannot contribute after end time");
        });

        it("reverts if amount is 0", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);
            const [, , user2] = await ethers.getSigners();

            await time.increase(time.duration.hours(1));

            await expect(
                funding.connect(user2).contribute(0, parseUnits("0", 18))
            ).to.be.revertedWith("Amount is required");
        });

        it("reverts if project doesn't exist", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);
            const [, , user2] = await ethers.getSigners();

            await time.increase(time.duration.hours(1));

            await expect(
                funding.connect(user2).contribute(1, parseUnits("10", 18))
            ).to.be.revertedWith("Project does not exist");
        });

        it("reverts if user didn't set proper allowance", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);
            const [, , user2] = await ethers.getSigners();

            await time.increase(time.duration.hours(1));

            await expect(
                funding.connect(user2).contribute(0, parseUnits("10", 18))
            ).to.be.revertedWith("ERC20: insufficient allowance");
        });

        it("reverts if user doesn't have enough tokens", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);
            const [, , user2] = await ethers.getSigners();

            await time.increase(time.duration.hours(1));

            await raiseToken
                .connect(user2)
                .approve(funding.address, parseUnits("10", 18));

            await expect(
                funding.connect(user2).contribute(0, parseUnits("10", 18))
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });

        it("works if all conditions are met", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await expect(
                funding.connect(user).contribute(0, parseUnits("10", 18))
            ).to.not.be.reverted;

            expect(await raiseToken.balanceOf(funding.address)).to.equal(
                parseUnits("10", 18)
            );
            expect(await funding.contributions(0, user.address)).to.equal(
                parseUnits("10", 18)
            );
            expect((await funding.projects(0)).currentRaiseAmount).to.equal(
                parseUnits("10", 18)
            );
        });

        it("works if user wants add more", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await expect(
                funding.connect(user).contribute(0, parseUnits("10", 18))
            ).to.not.be.reverted;

            expect(await raiseToken.balanceOf(funding.address)).to.equal(
                parseUnits("20", 18)
            );
            expect(await funding.contributions(0, user.address)).to.equal(
                parseUnits("20", 18)
            );
            expect((await funding.projects(0)).currentRaiseAmount).to.equal(
                parseUnits("20", 18)
            );
        });

        it("works with multiple users", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);
            const [, , user2] = await ethers.getSigners();

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await raiseToken.mint(user2.address, parseUnits("10", 18));
            await raiseToken
                .connect(user2)
                .approve(funding.address, parseUnits("10", 18));

            await expect(
                funding.connect(user2).contribute(0, parseUnits("10", 18))
            ).to.not.be.reverted;

            expect(await raiseToken.balanceOf(funding.address)).to.equal(
                parseUnits("20", 18)
            );
            expect(await funding.contributions(0, user.address)).to.equal(
                parseUnits("10", 18)
            );
            expect(await funding.contributions(0, user2.address)).to.equal(
                parseUnits("10", 18)
            );
            expect((await funding.projects(0)).currentRaiseAmount).to.equal(
                parseUnits("20", 18)
            );
        });
    });

    describe("reduceContribution", function () {
        it("reverts if project doesn't exist", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await expect(
                funding.connect(user).reduceContribution(1, parseUnits("5", 18))
            ).to.be.revertedWith("Project does not exist");
        });

        it("reverts if user didn't contribute", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await expect(
                funding.connect(user).reduceContribution(0, parseUnits("5", 18))
            ).to.be.revertedWith("Amount exceeds contribution amount");
        });

        it("reverts if amount is 0", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await expect(
                funding.connect(user).reduceContribution(0, parseUnits("0", 18))
            ).to.be.revertedWith("Amount is required");
        });

        it("reverts if amount exceeds contribution amount", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await expect(
                funding
                    .connect(user)
                    .reduceContribution(0, parseUnits("11", 18))
            ).to.be.revertedWith("Amount exceeds contribution amount");
        });

        it("works if all conditions are met", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await expect(
                funding.connect(user).reduceContribution(0, parseUnits("5", 18))
            ).to.not.be.reverted;

            expect(await raiseToken.balanceOf(funding.address)).to.equal(
                parseUnits("5", 18)
            );
            expect(await raiseToken.balanceOf(user.address)).to.equal(
                parseUnits("5", 18)
            );
            expect(await funding.contributions(0, user.address)).to.equal(
                parseUnits("5", 18)
            );
            expect((await funding.projects(0)).currentRaiseAmount).to.equal(
                parseUnits("5", 18)
            );
        });

        it("reverts if raise period ended", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await time.increase(time.duration.hours(3));

            await expect(
                funding.connect(user).reduceContribution(0, parseUnits("5", 18))
            ).to.be.revertedWith("Cannot reduce contribution after end time");
        });
    });

    describe("claimEquity", function () {
        it("reverts if project doesn't exist", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await expect(
                funding.connect(user).claimEquity(1)
            ).to.be.revertedWith("Project does not exist");
        });

        it("reverts if raise period did not end", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await expect(
                funding.connect(user).claimEquity(0)
            ).to.be.revertedWith("Cannot claim equity before end time");
        });

        it("reverts if user didn't contribute", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(4));

            await expect(
                funding.connect(user).claimEquity(0)
            ).to.be.revertedWith("No contribution to claim equity for");
        });

        it("reverts if user already claimed", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await time.increase(time.duration.hours(3));

            await funding.connect(user).claimEquity(0);

            await expect(
                funding.connect(user).claimEquity(0)
            ).to.be.revertedWith("Equity already claimed");
        });

        it("works if all conditions are met", async function () {
            const { funding, user, raiseToken, equityToken } =
                await loadFixture(createProject);

            await time.increase(time.duration.hours(1));

            await raiseToken.mint(user.address, parseUnits("10", 18));
            await raiseToken
                .connect(user)
                .approve(funding.address, parseUnits("10", 18));

            await funding.connect(user).contribute(0, parseUnits("10", 18));

            await time.increase(time.duration.hours(3));

            await expect(funding.connect(user).claimEquity(0)).to.not.be
                .reverted;

            expect(await equityToken.balanceOf(user.address)).to.equal(
                parseUnits("10", 18)
            );
            expect(await equityToken.balanceOf(funding.address)).to.equal(
                parseUnits("90", 18)
            );
            expect(await funding.claimedEquity(0, user.address)).to.be.true;
        });
    });
});
