import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { BytesLike, formatBytes32String, keccak256, parseBytes32String } from 'ethers/lib/utils';
import { ethers } from 'hardhat';
const { utils } = ethers;

describe('GuessTheSecretNumberChallenge', () => {
  let target: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('GuessTheSecretNumberChallenge', deployer)
    ).deploy({
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const hashToFind = '0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365';
    let answer: any;

    for (answer = 0; answer < 255; answer++) {
      if (ethers.utils.keccak256(answer) === hashToFind) {
        target.guess(answer, { value: ethers.utils.parseEther('1') });
      }
    }

    expect(await target.isComplete()).to.equal(true);
  });
});
