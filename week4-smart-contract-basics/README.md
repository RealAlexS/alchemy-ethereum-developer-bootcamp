# Emit the Winner Event

Your goal is simple! Emit the winner event on this smart contract on the Sepolia testnet: https://sepolia.etherscan.io/address/0x1B6a2684B5b134a3E85A366259A1da215858CB12#code


This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

```
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
    event Winner(address);

    function attempt() external {
        require(msg.sender != tx.origin, "msg.sender is equal to tx.origin");
        emit Winner(msg.sender);
    }
}
```

How do we possibly make it so the `tx.origin` (the EOA who originated the transaction) is not equal to the `msg.sender`? 

We'll leave that challenge up to you!



### Installation

```
npm install
```

### Scripts

```
npx hardhat run scripts/deploy.js --network sepolia

```

```
npx hardhat run scripts/callAttempt.js --network sepolia

```
