import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract, ContractFactory } from 'ethers';
import { ethers } from 'hardhat';

describe('DeployAContract', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let factory: ContractFactory;
  let target: Contract;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();
    factory = await ethers.getContractFactory('DeployChallenge', deployer);
    target = await factory.deploy();
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
