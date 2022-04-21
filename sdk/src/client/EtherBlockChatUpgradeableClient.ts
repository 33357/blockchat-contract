import { Provider } from '@ethersproject/providers';
import {
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ethers,
  PayableOverrides,
  Signer
} from 'ethers';
import {
  BlockChatUpgradeableClient,
  BlockChatUpgradeable,
  BlockChatUpgradeable__factory,
  DeploymentInfo
} from '..';
import {
  Message,
  MessageCreatedEvent,
  MessageToRecipientList,
  MessageToRecipientListCreatedEvent
} from '../model';

export class EtherBlockChatUpgradeableClient
  implements BlockChatUpgradeableClient {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _contract: BlockChatUpgradeable | undefined;
  private _errorTitle: string | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherBlockChatUpgradeableClient';
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
      address =
        DeploymentInfo[network.chainId].BlockChatUpgradeable.proxyAddress;
    }
    this._contract = BlockChatUpgradeable__factory.connect(address, provider);
    this._provider = provider;
    if (waitConfirmations) {
      this._waitConfirmations = waitConfirmations;
    }
  }

  public address(): string {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  async _check() {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
  }

  public async implementationVersion(config?: CallOverrides): Promise<string> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.implementationVersion({ ...config });
  }

  public async getRecipientHash(
    name: string,
    config?: CallOverrides
  ): Promise<BytesLike> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getRecipientHash(name, { ...config });
  }

  public async getSenderMessageListLength(
    sender: string,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getSenderMessageListLength(sender, { ...config });
  }

  public async getRecipientMessageListLength(
    recipient: BytesLike,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getRecipientMessageListLength(recipient, {
      ...config
    });
  }

  public async messageLength(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.messageLength({ ...config });
  }

  public async senderMessageListMap(
    sender: string,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.senderMessageListMap(sender, index, { ...config });
  }

  public async recipientMessageListMap(
    recipient: BytesLike,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.recipientMessageListMap(recipient, index, {
      ...config
    });
  }

  public async messageMap(
    messageId: BigNumberish,
    config?: CallOverrides
  ): Promise<Message> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.messageMap(messageId, { ...config });
  }

  public async batchSenderMessageId(
    sender: string,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumber>> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.batchSenderMessageId(sender, start, length, {
      ...config
    });
  }

  public async batchRecipientMessageId(
    recipient: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumber>> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.batchRecipientMessageId(recipient, start, length, {
      ...config
    });
  }

  public async batchMessage(
    messageIdList: Array<BigNumberish>,
    config?: CallOverrides
  ): Promise<[Array<Message>, Array<MessageToRecipientList>]> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.batchMessage(messageIdList, { ...config });
  }

  public async publicKeyMap(
    address: string,
    config?: CallOverrides
  ): Promise<string>{
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.publicKeyMap(address, { ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async createMessage(
    recipient: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<MessageCreatedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.createMessage(recipient, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .createMessage(recipient, content, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
    let message;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          message = (event.args as unknown) as MessageCreatedEvent;
        });
    }
    if (message) {
      return message;
    } else {
      throw new Error('no event');
    }
  }

  public async uploadPublicKey(
    publicKey: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.uploadPublicKey(publicKey, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .uploadPublicKey(publicKey, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
  }

  public async createMessageToRecipientList(
    recipientList: Array<BytesLike>,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<MessageToRecipientListCreatedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.createMessageToRecipientList(recipientList, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .createMessageToRecipientList(recipientList, content, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    if (callback) {
      callback(transaction);
    }
    const receipt = await transaction.wait(this._waitConfirmations);
    if (callback) {
      callback(receipt);
    }
    let message;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          message = (event.args as unknown) as MessageToRecipientListCreatedEvent;
        });
    }
    if (message) {
      return message;
    } else {
      throw new Error('no event');
    }
  }

  /* ================ LISTEN FUNCTIONS ================ */

  public async listenMessage(callback: Function): Promise<void> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    this._contract.connect(this._provider).on('MessageCreated', (...args) => {
      const event: MessageCreatedEvent = {
        messageId: args[0],
        sender: args[1],
        recipient: args[2],
        createDate: args[3]
      };
      callback(event);
    });
  }

  /* ================ UTILS FUNCTIONS ================ */

  public recipientHash(name: string): BytesLike {
    return ethers.utils.solidityKeccak256(['string'], [name]);
  }
}
