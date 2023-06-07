// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Funding {
    using SafeERC20 for IERC20;

    struct Project {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 targetRaiseAmount;
        address equityToken;
        uint256 equityAmount;
        uint256 currentRaiseAmount;
        uint256 startTime;
        uint256 endTime;
    }

    // projectId => address => amount
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // projectId => address => claimed
    mapping(uint256 => mapping(address => bool)) public claimedEquity;

    IERC20 public immutable raiseToken;

    Project[] public projects;

    //keep an id in order to know how many projects exists
    uint256 public lastProjectId;
    
    constructor (address raiseToken_) {
        raiseToken = IERC20(raiseToken_);
        lastProjectId = 0;
    }

    event Contributed(address indexed funder, uint256 indexed projectID, uint256 amount);
    event ReduceContribution(address indexed funder, uint256 indexed projectID, uint256 amount);

    function createProject(
        string memory title_,
        string memory description_,
        uint256 targetRaiseAmount_,
        address equityToken_,
        uint256 equityAmount_,
        uint256 startTime,
        uint256 endTime
    ) public {
        require(bytes(title_).length > 0, "Title is required");
        require(bytes(description_).length > 0, "Description is required");
        require(targetRaiseAmount_ > 0, "Target raise amount is required");
        require(equityToken_ != address(0), "Equity token is required");
        require(equityAmount_ > 0, "Equity amount is required");
        require(block.timestamp < startTime, "Start time must be in the future");
        require(startTime < endTime, "Start time must be before end time");

        Project memory project;
        project.id = projects.length;
        project.creator = msg.sender;
        project.title = title_;
        project.description = description_;
        project.targetRaiseAmount = targetRaiseAmount_;
        project.equityToken = equityToken_;
        project.equityAmount = equityAmount_;
        project.startTime = startTime;
        project.endTime = endTime;
        projects.push(project);

        lastProjectId++;
        // transfer the tokens to be distributed from the creator to the contract
        // this will fail if the user doesn't have enough tokens or didn't approve the transfer
        // doing this last to avoid a reentrancy attack (check-effects-interactions pattern)
        IERC20(equityToken_).safeTransferFrom(msg.sender, address(this), equityAmount_);
    }

    function contribute(uint256 projectId, uint256 amount) public {
        require(projectId < projects.length, "Project does not exist");
        require(amount > 0, "Amount is required");

        Project storage project = projects[projectId];
        require(project.currentRaiseAmount + amount <= project.targetRaiseAmount, "Amount exceeds target raise amount");
        require(project.startTime <= block.timestamp, "Cannot contribute before start time");
        require(block.timestamp <= project.endTime, "Cannot contribute after end time");

        project.currentRaiseAmount += amount;
        project.noOfFunders++;
        contributions[projectId][msg.sender] += amount;

        // transfer the tokens to be distributed from the creator to the contract
        // this will fail if the user doesn't have enough tokens or didn't approve the transfer
        raiseToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Contributed(msg.sender,projectId,amount);
    }

    function reduceContribution(uint256 projectId, uint256 amount) public {
        require(projectId < projects.length, "Project does not exist");
        require(amount > 0, "Amount is required");

        Project storage project = projects[projectId];
        require(contributions[projectId][msg.sender] >= amount, "Amount exceeds contribution amount");
        require(block.timestamp < project.endTime, "Cannot reduce contribution after end time");

        project.currentRaiseAmount -= amount;
        project.noOfFunders--;
        contributions[projectId][msg.sender] -= amount;

        raiseToken.safeTransfer(msg.sender, amount);

        emit ReduceContribution(msg.sender,projectId,amount);
    }

    function claimEquity(uint256 projectId) public {
        require(projectId < projects.length, "Project does not exist");

        Project storage project = projects[projectId];
        require(project.endTime < block.timestamp, "Cannot claim equity before end time");

        uint256 contribution = contributions[projectId][msg.sender];
        require(contribution > 0, "No contribution to claim equity for");

        require(!claimedEquity[projectId][msg.sender], "Equity already claimed");

        // calculate the amount of equity to distribute related to the percentage of raised amount
        uint256 equityToDistribute = (project.equityAmount * project.currentRaiseAmount) / project.targetRaiseAmount;

        uint256 equityAmount = (contribution * equityToDistribute) / project.currentRaiseAmount;

        claimedEquity[projectId][msg.sender] = true;

        IERC20(project.equityToken).safeTransfer(msg.sender, equityAmount);
    }

    /// Allows the project creator to withdraw the remaining equity if the target raise amount was not reached
    /// @dev Only works if the raise period ended and the target raise amount was not reached
    /// @param projectId The id of the project
    function withdrawRemainingEquity(uint256 projectId) public {
        require(projectId < projects.length, "Project does not exist");

        Project storage project = projects[projectId];
        require(project.endTime < block.timestamp, "Cannot withdraw before end time");

        require(msg.sender == project.creator, "Only the creator can withdraw remaining equity");

        require(project.currentRaiseAmount < project.targetRaiseAmount, "Cannot withdraw if target raise amount was reached");

        uint256 equityToDistribute = (project.equityAmount * project.currentRaiseAmount) / project.targetRaiseAmount;

        IERC20(project.equityToken).safeTransfer(msg.sender, project.equityAmount - equityToDistribute);
    }

    //Allows the project creator to withdraw the funds if raised amount > 0
    function withdrawFunds(uint256 projectId) public {
        require(projectId < projects.length, "Project does not exist");

        Project storage project = projects[projectId];
        require(project.endTime < block.timestamp, "Cannot withdraw before end time");

        require(msg.sender == project.creator, "Only the creator can withdraw remaining equity");

        require(project.currentRaiseAmount > 0 , "No funds to withdraw");

        raiseToken.safeTransfer(msg.sender, project.currentRaiseAmount);
    }

}
