import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
const { utils, provider } = ethers;

describe('GuessTheNewNumberChallenge', () => {
  let target: Contract;
  let attackerContract: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('GuessTheNewNumberChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = await target.connect(attacker);

    await target.deployed();

    target = await target.connect(attacker);

    attackerContract = await (
      await ethers.getContractFactory('GuessTheNewNumberChallengeAttacker', attacker)
    ).deploy(target.address);

    await attackerContract.deployed();

    attackerContract = attackerContract.connect(attacker);
  });

  it('exploit', async () => {
    await attackerContract.attack({ value: utils.parseEther('1') });

    expect(await provider.getBalance(target.address)).to.equal(0);
  });
});
