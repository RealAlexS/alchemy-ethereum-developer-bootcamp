const express = require("express");
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02600e725265123b4ac2e8c1b2af603ebb7a911cf63afb4b8ead44024510612680": 100, // 0a2f95ecad1cfd63baa969be70352ad207cb5766f51b4b2eef79134218d78117
  "0394baa65b6d9a675db4e6861d0c6a99a1bd6a93c32ed87554106837ee40d00e83": 50, // 3dca836442653edbc5b256a74333975035c08310df3f3c59c1b29c85c295228c
  "03965f0a15b840ae629338226492f2ffc9711e09f63b50d4a6834fc1591e7bb45d": 75, // 293c250f891a86d2257bda51c0de3fb05a7f8a56eec24f98f2ddafc78d8f617e
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  // verify signature
  const sig = {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    recovery: signature.recovery,
  };

  const data = { sender, recipient, amount };
  const bytes = utf8ToBytes(JSON.stringify(data));
  const msgHash = keccak256(bytes);
  const isSigned = secp256k1.verify(sig, msgHash, sender);

  if (!isSigned) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
