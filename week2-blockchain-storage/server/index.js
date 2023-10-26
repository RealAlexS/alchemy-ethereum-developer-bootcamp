const express = require('express');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');
const verifyProof = require('../utils/verifyProof');

const port = 1225;

const app = express();
app.use(express.json());

// hardcode a merkle root here representing the whole nice list
const merkleTree = new MerkleTree(niceList)
const root = merkleTree.getRoot();

// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = root

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const { name , proof } = req.body;

  // prove that a name is in the list 
  const isInTheList = verifyProof(proof, name, MERKLE_ROOT);
  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});