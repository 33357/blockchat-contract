import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {BigNumber, Signer} from 'ethers';
import pino from 'pino';
import {EtherBlockChatUpgradeableClient, BlockChatUpgradeable} from '../sdk/dist';

const Logger = pino();
const contractName = 'BlockChatUpgradeable';

describe(`test ${contractName} sdk`, function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe(`test ${contractName} sdk`, function () {
    const contract = new EtherBlockChatUpgradeableClient();

    beforeEach(`deploy and init ${contractName}`, async () => {
      const Contract = await ethers.getContractFactory(`${contractName}`);
      const contractResult = await upgrades.deployProxy(
        Contract.connect(deployer),
        [],
        {
          kind: 'uups',
        }
      );
      await contract.connect(deployer, contractResult.address, 1);
      Logger.info(`deployed ${contractName}`);
    });

    it('check init data', async function () {
      expect(await contract.implementationVersion()).to.be.equal('1.0.0');
      expect(await contract.messageLength()).to.be.equal(0);
    });

    it('check create Message', async function () {
      const recipientHash = await contract.getRecipientHash('北京')
      expect(await contract.getRecipientMessageListLength(recipientHash)).to.be.equal(0);
      expect(await contract.getSenderMessageListLength(await deployer.getAddress())).to.be.equal(0);

      await contract.createMessage(recipientHash,'你好');

      expect(await contract.messageLength()).to.be.equal(1);
      expect(await contract.getRecipientMessageListLength(recipientHash)).to.be.equal(1);
      expect(await contract.getSenderMessageListLength(await deployer.getAddress())).to.be.equal(1);

      expect(await contract.recipientMessageListMap(recipientHash,0)).to.be.equal(1);
      expect(await contract.senderMessageListMap(await deployer.getAddress(),0)).to.be.equal(1);

      console.log(await contract.messageMap(1));
    });

    
  });

  describe(`test ${contractName}`, function () {
    let contract: BlockChatUpgradeable;

    beforeEach('deploy and init contract', async () => {
      const Contract = await ethers.getContractFactory(contractName);
      contract = (await upgrades.deployProxy(
        Contract.connect(deployer),
        [],
        {
          kind: 'uups',
        }
      )) as BlockChatUpgradeable;
      Logger.info(`deployed ${contractName}`);
    });

    it('check admin', async function () {
      const Contract = await ethers.getContractFactory(contractName);
      await expect(
        upgrades.upgradeProxy(contract.address, Contract.connect(accountA), {
          kind: 'uups',
        })
      ).revertedWith(`${contractName}: require admin permission`);
      await upgrades.upgradeProxy(
        contract.address,
        Contract.connect(deployer),
        {
          kind: 'uups',
        }
      );

      await expect(contract.connect(accountA).pause()).revertedWith(
        `${contractName}: require admin permission`
      );
      await contract.connect(deployer).pause();
      expect(await contract.paused()).equal(true);

      await expect(contract.connect(accountA).unpause()).revertedWith(
        `${contractName}: require admin permission`
      );
      await contract.connect(deployer).unpause();
      expect(await contract.paused()).equal(false);
    });
  });
});
