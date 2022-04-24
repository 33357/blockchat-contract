import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {getImplementationAddress} from '@openzeppelin/upgrades-core';
import {PayableOverrides} from 'ethers';
import {
  EthersExecutionManager,
  getDeployment,
  LOCK_DIR,
  RETRY_NUMBER,
  log,
  setDeployment,
} from '../utils';

const contract = 'BlockChatUpgradeable2';
const taskName = `${contract}:update`;

task(taskName, `Update ${contract}`)
  .addOptionalParam('waitNum', 'The waitNum to transaction')
  .addOptionalParam('gasPrice', 'The gasPrice to transaction')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const txConfig: PayableOverrides = {};
    txConfig.gasPrice = args['gasPrice']
      ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
      : undefined;
    const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
    const ethersExecutionManager = new EthersExecutionManager(
      `${LOCK_DIR}/${taskName}.lock`,
      RETRY_NUMBER,
      waitNum
    );
    await ethersExecutionManager.load();
    const operator = (await hre.ethers.getSigners())[0];
    const chainId = Number(await hre.getChainId());

    log.info(`update ${contract}`);
    const deployment = await getDeployment(chainId);
    const Contract = await hre.ethers.getContractFactory(contract);
    const updateResult = await ethersExecutionManager.transaction(
      (<any>hre).upgrades.upgradeProxy,
      [
        deployment[contract].proxyAddress,
        Contract.connect(operator),
        {kind: 'uups'},
      ],
      ['blockNumber'],
      `update ${contract}`,
      txConfig
    );
    const contractProxyAddress = deployment[contract].proxyAddress;
    const contractImplAddress = await getImplementationAddress(
      hre.ethers.provider,
      contractProxyAddress
    );
    const contractFromBlock = updateResult.blockNumber;
    const _contract = Contract.attach(contractProxyAddress);
    const contractVersion = await ethersExecutionManager.call(
      _contract.implementationVersion,
      [],
      `${contract} implementationVersion`
    );
    log.info(
      `${contract} update proxy at ${contractProxyAddress},impl at ${contractImplAddress},version ${contractVersion},fromBlock ${contractFromBlock}`
    );

    deployment[contract] = {
      proxyAddress: contractProxyAddress,
      implAddress: contractImplAddress,
      version: contractVersion,
      contract: contract,
      operator: operator.address,
      fromBlock: contractFromBlock,
    };

    await setDeployment(chainId, deployment);

    ethersExecutionManager.printGas();
    ethersExecutionManager.deleteLock();
  });
