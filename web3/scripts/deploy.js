async function main() {
    const HelloWorld = await ethers.getContractFactory("Funding");
 
    // Start deployment, returning a promise that resolves to a contract object
    const hello_world = await HelloWorld.deploy("0x024Db6caB962315Db451b3a8aa6Fe7b8020666f1");
    console.log("Contract deployed to address:", hello_world.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });