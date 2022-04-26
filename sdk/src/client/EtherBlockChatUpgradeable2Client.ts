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
  BlockChatUpgradeable2Client,
  BlockChatUpgradeable2,
  BlockChatUpgradeable2__factory,
  DeploymentInfo
} from '..';
import { BlockChatUpgrade2Model } from '../model';

export class EtherBlockChatUpgradeable2Client
  implements BlockChatUpgradeable2Client {
  protected _provider: Provider | Signer | undefined;
  protected _waitConfirmations = 3;
  private _contract: BlockChatUpgradeable2 | undefined;
  private _errorTitle: string | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherBlockChatUpgradeable2Client';
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
        DeploymentInfo[network.chainId].BlockChatUpgradeable2.proxyAddress;
    }
    this._contract = BlockChatUpgradeable2__factory.connect(address, provider);
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

  public async getMessageHash(
    sender: string,
    createDate: BigNumberish,
    createBlock: BigNumberish,
    recipientList: Array<BytesLike>,
    content: string,
    config?: CallOverrides
  ): Promise<string> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getMessageHash(
      sender,
      createDate,
      createBlock,
      recipientList,
      content,
      { ...config }
    );
  }

  public async dataMap(
    address: string,
    dataHash: BytesLike,
    config?: CallOverrides
  ): Promise<number> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.dataMap(address, dataHash, { ...config });
  }

  public async getDataHash(
    name: string,
    config?: CallOverrides
  ): Promise<string> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.getDataHash(name, { ...config });
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

  public async getRecipientMessageListLength(
    recipient: BytesLike,
    config?: CallOverrides
  ): Promise<number> {
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

  public async messageLength(config?: CallOverrides): Promise<number> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.messageLength({ ...config });
  }

  public async recipientMessageListMap(
    recipient: BytesLike,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<number> {
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
  ): Promise<BlockChatUpgrade2Model.Message> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return this._contract.messageMap(messageId, { ...config });
  }

  public async batchRecipientMessageId(
    recipient: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<number>> {
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
  ): Promise<Array<BlockChatUpgrade2Model.Message>> {
    if (!this._provider) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    if (!this._contract) {
      throw new Error(`${this._errorTitle}: no contract`);
    }
    return await this._contract.batchMessage(messageIdList, { ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async createMessage(
    recipientHash: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgrade2Model.MessageCreatedEvent> {
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
    let _event;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          _event = (event.args as unknown) as BlockChatUpgrade2Model.MessageCreatedEvent;
        });
    }
    if (_event) {
      return _event;
    } else {
      throw new Error('no event');
    }
  }

  public async createMessageToList(
    recipientHashList: Array<BytesLike>,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgrade2Model.MessageCreatedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.createMessageToList(recipientHashList, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .createMessageToList(recipientHashList, content, {
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
    let _event;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          _event = (event.args as unknown) as BlockChatUpgrade2Model.MessageCreatedEvent;
        });
    }
    if (_event) {
      return _event;
    } else {
      throw new Error('no event');
    }
  }

  public async createMessageWithData(
    recipientHash: BytesLike,
    content: string,
    data: BytesLike,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgrade2Model.MessageCreatedEvent> {
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
    let _event;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          _event = (event.args as unknown) as BlockChatUpgrade2Model.MessageCreatedEvent;
        });
    }
    if (_event) {
      return _event;
    } else {
      throw new Error('no event');
    }
  }

  public async uploadData(
    dataHash: BytesLike,
    content: string,

    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgrade2Model.DataUploadedEvent> {
    if (
      !this._provider ||
      !this._contract ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._contract
      .connect(this._provider)
      .estimateGas.uploadData(dataHash, content, {
        ...config
      });
    const transaction = await this._contract
      .connect(this._provider)
      .uploadData(dataHash, content, {
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
    let _event;
    if (receipt.events) {
      receipt.events
        .filter(event => event.event === 'MessageCreated' && event.args)
        .map(event => {
          _event = (event.args as unknown) as BlockChatUpgrade2Model.DataUploadedEvent;
        });
    }
    if (_event) {
      return _event;
    } else {
      throw new Error('no event');
    }
  }

  /* ================ LISTEN FUNCTIONS ================ */

  public async listenMessage(callback: Function): Promise<void> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    this._contract
      .connect(this._provider)
      .on(this._contract.filters.MessageCreated(), (...args) => {
        const event: BlockChatUpgrade2Model.MessageCreatedEvent = {
          messageId: args[0],
          createDate: args[1],
          sender: args[2],
          recipientList: args[3],
          content: args[4]
        };
        callback(event);
      });
  }

  public async getMessage(
    messageId: BigNumberish,
    from: number,
    to: number
  ): Promise<Array<BlockChatUpgrade2Model.MessageCreatedEvent>> {
    if (!this._provider || !this._contract) {
      return Promise.reject('need to connect a valid provider');
    }
    const res = await this._contract
      .connect(this._provider)
      .queryFilter(this._contract.filters.MessageCreated(messageId), from, to);
    const events: Array<BlockChatUpgrade2Model.MessageCreatedEvent> = [];
    res.forEach(event => {
      events.push({
        messageId: event.args[0],
        createDate: event.args[1],
        sender: event.args[2],
        recipientList: event.args[3],
        content: event.args[4]
      });
    });
    return events;
  }

  /* ================ UTILS FUNCTIONS ================ */

  public recipientHash(name: string): string {
    return (
      '0x' + ethers.utils.solidityKeccak256(['string'], [name]).substring(26)
    );
  }

  public dataHash(name: string): string {
    return ethers.utils.solidityKeccak256(['string'], [name]);
  }

  public messageHash(
    sender: string,
    createDate: BigNumberish,
    createBlock: BigNumberish,
    recipientList: Array<BytesLike>,
    content: string
  ): string {
    return (
      '0x' +
      ethers.utils
        .solidityKeccak256(
          ['address', 'uint48', 'uint48', 'bytes20[]', 'string'],
          [sender, createDate, createBlock, recipientList, content, createDate]
        )
        .substring(14)
    );
  }
}
