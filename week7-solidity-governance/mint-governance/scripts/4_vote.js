const { loadFile } = require("./utils/json");
const { getContract } = require("./utils/contract");

async function main() {
  // Get the deployed MyGovernor contract
  const governor = await getContract("MyGovernor");

  // Load the first Proposal ID from the JSON file
  const proposals = loadFile("scripts/tmp", "proposals.json");
  const proposalId = Object.keys(proposals)[0];
  console.log(`Proposal ID: ${proposalId}`);

  // Cast a vote on a proposal
  const voteOption = 1; // 0 for against, 1 for in favor
  await governor.castVote(proposalId, voteOption);

  console.log(`Vote casted on proposal ID ${proposalId}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { main };