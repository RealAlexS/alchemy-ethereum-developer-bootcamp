const hre = require("hardhat");

async function main() {
  const lottery = await hre.ethers.deployContract("Lottery");

  await lottery.waitForDeployment();

  console.log(`Lottery deployed to ${lottery.target}`);


  const caller = await hre.ethers.deployContract("Caller");

  await caller.waitForDeployment();

  console.log(`Caller deployed to ${caller.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
