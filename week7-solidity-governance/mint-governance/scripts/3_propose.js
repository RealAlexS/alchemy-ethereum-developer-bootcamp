const { ethers } = require("hardhat");
const { writeFile, loadFile } = require("./utils/json");
const { getContract } = require("./utils/contract");

async function main() {
  const [owner] = await ethers.getSigners();

  // Get the deployed MyGovernor and MyToken contracts
  const governor = await getContract("MyGovernor");
  const token = await getContract("MyToken");

  // Create a new proposal
  const proposal = {
    // Target address
    target: [token.address],
    // Value (zero for calling a function)
    value: [0],
    // Function signature and parameters
    data: [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther("25000")])],
    // Proposal description
    description: "Give the deployer more tokens!"
  }

  const proposalTx = await governor.propose(
    proposal.target, 
    proposal.value, 
    proposal.data,
    proposal.description
  );
  const proposalReceipt = await proposalTx.wait();
  const event = proposalReceipt.events.find(x => x.event === 'ProposalCreated');
  const proposalId = event.args.proposalId.toString(); // Convert BigNumber to string

  // Write addresses to a JSON file
  const proposals = { [proposalId]: proposal };
  writeFile("scripts/tmp", "proposals.json", proposals);

  console.log(`Proposal created with ID: ${proposalId}`);

  // wait for the 1 block voting delay
  console.log("Waiting for 1 block voting delay...");
  await hre.network.provider.send("evm_mine");
  console.log("1 block voting delay passed");


}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { main };
