const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('ContractInteraction', function () {

  async function deployContractsFixture() {
    const lottery = await ethers.deployContract('Lottery');
    const caller = await ethers.deployContract('Caller');
    return { lottery, caller};
  }

  it("should revert when called directly by an EOA", async function () {
    const { lottery } = await loadFixture(
      deployContractsFixture
    );
    await expect(lottery.attempt()).to.be.revertedWith("msg.sender is equal to tx.origin");
  });

  it("should emit 'Winner' event when called by another contract", async function () {
    const { lottery, caller } = await loadFixture(
      deployContractsFixture
    );
      await expect(caller.callAttempt(lottery.target)).to.emit(lottery, 'Winner');
  });
});