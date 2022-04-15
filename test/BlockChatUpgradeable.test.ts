import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {BigNumber, Signer} from 'ethers';
import pino from 'pino';
import {
  EtherBlockChatUpgradeableClient,
  BlockChatUpgradeable,
} from '../sdk/dist';

const Logger = pino();
const contractName = 'BlockChatUpgradeable';

describe(`test ${contractName}`, function () {
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
      expect(await contract.implementationVersion()).to.be.equal('1.1.0');
      expect(await contract.messageLength()).to.be.equal(0);
    });

    it('check create Message', async function () {
      const recipientHash = await contract.getRecipientHash('北京');
      expect(
        await contract.getRecipientMessageListLength(recipientHash)
      ).to.be.equal(0);
      expect(
        await contract.getSenderMessageListLength(await deployer.getAddress())
      ).to.be.equal(0);

      await contract.createMessage(recipientHash, '你好');

      expect(await contract.messageLength()).to.be.equal(1);
      expect(
        await contract.getRecipientMessageListLength(recipientHash)
      ).to.be.equal(1);
      expect(
        await contract.getSenderMessageListLength(await deployer.getAddress())
      ).to.be.equal(1);

      expect(
        await contract.recipientMessageListMap(recipientHash, 0)
      ).to.be.equal(1);
      expect(
        await contract.senderMessageListMap(await deployer.getAddress(), 0)
      ).to.be.equal(1);

      const message = await contract.messageMap(1);

      expect(message.sender).to.be.equal(await deployer.getAddress());
      expect(message.recipient).to.be.equal(recipientHash);
      expect(message.content).to.be.equal('你好');
      if (deployer.provider) {
        expect(message.createDate).to.be.equal(
          (await deployer.provider.getBlock('latest')).timestamp
        );
      }
    });
  });

  describe(`test ${contractName}`, function () {
    let contract: BlockChatUpgradeable;

    beforeEach('deploy and init contract', async () => {
      const Contract = await ethers.getContractFactory(contractName);
      contract = (await upgrades.deployProxy(Contract.connect(deployer), [], {
        kind: 'uups',
      })) as BlockChatUpgradeable;
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
    });
  });
});
