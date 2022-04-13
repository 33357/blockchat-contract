import { Provider } from '@ethersproject/providers';
import { BigNumber, BytesLike, CallOverrides, PayableOverrides, Signer } from 'ethers';
import {
  BlockChatUpgradeableClient,
  BlockChatUpgradeable,
  BlockChatUpgradeable__factory,
  DeploymentInfo
} from '..';

export class EtherBlockChatUpgradeableClient implements BlockChatUpgradeableClient {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _upgradeable: BlockChatUpgradeable | undefined;
  private _errorTitle: string | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherExampleUpgradeableClient';
    if (!address) {
      let network;
      if (provider instanceof Signer) {
        if (provider.provider) {
          network = await provider.provider.getNetwork();
        }
      } else {
        network = await provider.getNetwork();
      }
      if (!network) {
        throw new Error(`${this._errorTitle}: no provider`);
      }
      if (!DeploymentInfo[network.chainId]) {
        throw new Error(`${this._errorTitle}: error chain`);
      }
      address = DeploymentInfo[network.chainId].ExampleUpgradeable.proxyAddress;
    }
    this._upgradeable = BlockChatUpgradeable__factory.connect(address, provider);
    if (waitConfirmations) {
      this._waitConfirmations = waitConfirmations;
    }
  }

  public address(): string {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async implementationVersion(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.implementationVersion({ ...config });
  }

  public async getGroupHash(name: string, config?: CallOverrides): Promise<BytesLike> {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.getGroupHash(name, { ...config });
  }

  public async getSenderMessageListLength(sender: string, config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.getSenderMessageListLength(sender, { ...config });
  }

  public async getRecipientMessageListLength(recipient: BytesLike, config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._upgradeable) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._upgradeable.getRecipientMessageListLength(recipient, { ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */


  public async createMessage(recipient: BytesLike, content: string, config?: PayableOverrides, callback?: Function): Promise<void> {
    if (
      !this._provider ||
      !this._upgradeable ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._upgradeable
      .connect(this._provider)
      .estimateGas.createMessage(
        recipient,
        content,
        {
          ...config
        });
    const tx = await this._upgradeable.connect(this._provider).createMessage(recipient,
      content, {
      gasLimit: gas.mul(13).div(10),
      ...config
    });
    if (callback) {
      callback(tx);
    }
    const rx = await tx.wait(this._waitConfirmations);
    if (callback) {
      callback(rx);
    }
  }
}
