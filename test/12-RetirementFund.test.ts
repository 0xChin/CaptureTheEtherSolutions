import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
const { utils } = ethers;

describe('RetirementFundChallenge', () => {
  let target: Contract;
  let attackerContract: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('RetirementFundChallenge', deployer)
    ).deploy(attacker.address, {
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);

    attackerContract = await (
      await ethers.getContractFactory('RetirementFundChallengeAttacker', attacker)
    ).deploy({ value: 1 });
  });

  it('exploit', async () => {
    await attackerContract.rock(target.address);
    await target.collectPenalty();

    expect(await target.isComplete()).to.equal(true);
  });
});
