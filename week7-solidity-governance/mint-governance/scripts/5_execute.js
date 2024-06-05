const { ethers } = require("hardhat");
const { loadFile } = require("./utils/json");
const { getContract } = require("./utils/contract");

async function main() {
  // Get the deployed MyGovernor contract
  const governor = await getContract("MyGovernor");

  // Load the first Proposal ID and its data from the JSON file
  const proposals = loadFile("scripts/tmp", "proposals.json");
  const proposalId = Object.keys(proposals)[0];
  const proposal = proposals[proposalId];

  // Execute a proposal
  await governor.execute(
    proposal.target,
    proposal.value,
    proposal.data,
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal.description))
  );

  console.log(`Proposal with ID ${proposalId} executed successfully`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { main };