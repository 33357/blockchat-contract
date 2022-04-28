import { Provider } from '@ethersproject/providers';
import {
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
import { BlockChatUpgradeModel } from '../model';

export class EtherBlockChatUpgradeableClient
  implements BlockChatUpgradeableClient {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _contract: BlockChatUpgradeable | undefined;
  private _errorTitle: string | undefined;

  async connect(
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

  address(): string {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  async blockSkip(config?: CallOverrides): Promise<number> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.blockSkip({ ...config });
  }

  async dataBlockMap(
    dataHash: BytesLike,
    config?: CallOverrides
  ): Promise<number> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.dataBlockMap(dataHash, { ...config });
  }

  async implementationVersion(config?: CallOverrides): Promise<string> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.implementationVersion({ ...config });
  }

  async getRecipientHash(
    name: string,
    config?: CallOverrides
  ): Promise<BytesLike> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getRecipientHash(name, { ...config });
  }

  async getNameHash(name: string, config?: CallOverrides): Promise<string> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getNameHash(name, { ...config });
  }

  async getRecipientMessageBlockListLength(
    recipientHash: BytesLike,
    config?: CallOverrides
  ): Promise<number> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getRecipientMessageBlockListLength(recipientHash, {
      ...config
    });
  }

  async batchRecipientMessageBlock(
    recipientHash: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<number>> {
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.batchRecipientMessageBlock(
      recipientHash,
      start,
      length,
      {
        ...config
      }
    );
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  async createMessage(
    recipientHash: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.MessageCreatedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.createMessage(recipientHash, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .createMessage(recipientHash, content, {
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
    let messageCreatedEvent;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          messageCreatedEvent = (event.args as unknown) as BlockChatUpgradeModel.MessageCreatedEvent;
        });
    }
    if (!messageCreatedEvent) {
      throw new Error('no event');
    }
    return messageCreatedEvent;
  }

  async createMessageWithData(
    recipientHash: BytesLike,
    content: string,
    data: BytesLike,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.MessageCreatedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.createMessageWithData(recipientHash, content, data, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .createMessageWithData(recipientHash, content, data, {
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
    let messageCreatedEvent;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          messageCreatedEvent = (event.args as unknown) as BlockChatUpgradeModel.MessageCreatedEvent;
        });
    }
    if (!messageCreatedEvent) {
      throw new Error('no event');
    }
    return messageCreatedEvent;
  }

  async uploadData(
    nameHash: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.DataUploadedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.uploadData(nameHash, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .uploadData(nameHash, content, {
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
    let dataUploadedEvent;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'DataUploaded' && event.args)
        .map(event => {
          dataUploadedEvent = (event.args as unknown) as BlockChatUpgradeModel.DataUploadedEvent;
        });
    }
    if (!dataUploadedEvent) {
      throw new Error('no event');
    }
    return dataUploadedEvent;
  }

  /* ================ LISTEN FUNCTIONS ================ */

  async listenMessageCreatedEvent(callback: Function): Promise<void> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    this._contract
      .connect(this._provider)
      .on(this._contract.filters.MessageCreated(), (...args) => {
        const messageCreatedEvent: BlockChatUpgradeModel.MessageCreatedEvent = {
          sender: args[0],
          recipientHash: args[1],
          createDate: args[2],
          content: args[3]
        };
        callback(messageCreatedEvent);
      });
  }

  async getMessageCreatedEventList(
    sender: string | undefined,
    receiptHash: BytesLike | undefined,
    from: number,
    to: number
  ): Promise<Array<BlockChatUpgradeModel.MessageCreatedEvent>> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    const res = await this._contract
      .connect(this._provider)
      .queryFilter(
        this._contract.filters.MessageCreated(sender, receiptHash),
        from,
        to
      );
    const events: Array<BlockChatUpgradeModel.MessageCreatedEvent> = [];
    res.forEach(messageCreatedEventList => {
      events.push({
        sender: messageCreatedEventList.args[0],
        recipientHash: messageCreatedEventList.args[1],
        createDate: messageCreatedEventList.args[2],
        content: messageCreatedEventList.args[3]
      });
    });
    return events;
  }

  async getDataUploadedEvent(
    dataHash: BytesLike,
    from: number,
    to: number
  ): Promise<BlockChatUpgradeModel.DataUploadedEvent> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    const res = await this._contract
      .connect(this._provider)
      .queryFilter(this._contract.filters.DataUploaded(dataHash), from, to);
    const dataUploadedEvent: BlockChatUpgradeModel.DataUploadedEvent = {
      dataHash: res[0].args[0],
      content: res[0].args[1]
    };
    return dataUploadedEvent;
  }

  /* ================ UTILS FUNCTIONS ================ */

  recipientHash(name: string): string {
    return (
      '0x' + ethers.utils.solidityKeccak256(['string'], [name]).substring(26)
    );
  }

  nameHash(name: string): string {
    return ethers.utils.solidityKeccak256(['string'], [name]).substring(0, 26);
  }

  dataHash(address: string, name: string): string {
    return address + this.nameHash(name).replace('0x', '');
  }
}
