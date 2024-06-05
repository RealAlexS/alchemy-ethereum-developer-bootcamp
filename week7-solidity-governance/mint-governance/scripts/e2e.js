// Import the main functions from the scripts
const deploy = require("./1_deploy").main;
const delegate = require("./2_delegate").main;
const propose = require("./3_propose").main;
const vote = require("./4_vote").main;
const execute = require("./5_execute").main;

const assert = require('assert');
const { ethers } = require("hardhat");
const { getContract } = require("./utils/contract");

async function main() {
  const [owner] = await ethers.getSigners();

  // Execute the main function from deploy.js
  console.log("\nExecuting deploy.js...");
  await deploy();

  // Get the deployed MyGovernor contract
  const token = await getContract("MyToken");
  // Get the owner's balance of MyToken
  const balanceAfterDeployment = await token.balanceOf(owner.address);
  console.log(`Owner balance after deployment of contract: ${balanceAfterDeployment.toString()}`);

  // Execute the main function from delegate.js
  console.log("\nExecuting delegate.js...");
  await delegate();

  // Execute the main function from propose.js
  console.log("\nExecuting propose.js...");
  await propose();

  // Execute the main function from vote.js
  console.log("\nExecuting vote.js...");
  await vote();

      
  // Execute the main function from execute.js
  console.log("\nExecuting execute.js...");
  await execute();

  // Check if the owner's balance is correct
  const balanceAfterExecution = await token.balanceOf(owner.address);
  const expectedBalance = ethers.utils.parseEther("35000")

  assert.equal(balanceAfterExecution.toString(), expectedBalance.toString());

  console.log(`Owner balance after execution of proposal: ${balanceAfterExecution.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
