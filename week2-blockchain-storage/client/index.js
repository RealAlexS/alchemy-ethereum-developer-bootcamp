const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  const name = process.argv[2]

  if (!name) {
    throw Error ('No name provided to check the list for!')
  }

  const merkleTree = new MerkleTree(niceList)
  const index = niceList.indexOf(name);
  const proof = merkleTree.getProof(index)

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name,
    proof
  });

  console.log({ gift });
}

main();