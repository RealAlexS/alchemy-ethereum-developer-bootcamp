// https://docs.alchemy.com/docs/how-to-calculate-ethereum-miner-rewards

import { BigNumber } from "alchemy-sdk";

export const computeBlockReward = (block, transactionsReceipts) => {
  let minerTips = [];
  let sumMinerTips = 0;
  for (const tx of transactionsReceipts) {
    const gasUsed = BigNumber.from(tx.gasUsed);
    const effectiveGasPrice = BigNumber.from(tx.effectiveGasPrice);
    const totalFee = gasUsed.mul(effectiveGasPrice);
    minerTips.push(totalFee);
  }

  if (transactionsReceipts.length > 0) {
    sumMinerTips = minerTips.reduce((prevTip, currentTip) =>
      prevTip.add(currentTip),
    );
  }

  const burntFee = computeBurntFee(block);

  const baseBlockReward = BigNumber.from(2);

  const blockReward = baseBlockReward.add(sumMinerTips.sub(burntFee));

  return blockReward;
};

export const computeBurntFee = (block) => {
  const { gasUsed, baseFeePerGas } = block;
  return gasUsed.mul(baseFeePerGas);
};

export const computeDeviationFromGasTarget = (block) => {
  const { gasUsed, gasLimit } = block;
  const TARGET = 0.5;
  return gasUsed / gasLimit / TARGET - 1;
};

export const decodeExtraData = (block) => {
  const { extraData } = block;
  // Remove the "0x" prefix
  const trimmedHex = extraData.slice(2);

  // Convert hex to ASCII
  const ascii = trimmedHex.replace(/../g, (hexPair) =>
    String.fromCharCode(parseInt(hexPair, 16)),
  );

  return ascii;
};
