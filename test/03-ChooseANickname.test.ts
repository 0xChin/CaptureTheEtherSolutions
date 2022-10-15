import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

describe('DeployAContract', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let captureTheEther: Contract;
  let target: Contract;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    captureTheEther = await (
      await ethers.getContractFactory('CaptureTheEther', attacker)
    ).deploy(attacker.address);

    await captureTheEther.deployed();

    target = await (
      await ethers.getContractFactory('NicknameChallenge')
    ).attach(await captureTheEther.playerNicknameContract(attacker.address));

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    await captureTheEther.setNickname(formatBytes32String('Chiin'));

    expect(await target.isComplete()).to.equal(true);
  });
});
