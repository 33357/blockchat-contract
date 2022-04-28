import {
  BigNumberish,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import { BlockChatUpgradeModel } from '../model';

export interface BlockChatUpgradeableClient {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  blockSkip(config?: CallOverrides): Promise<number>;

  dataBlockMap(dataHash: BytesLike, config?: CallOverrides): Promise<number>;

  implementationVersion(config?: CallOverrides): Promise<string>;

  getRecipientHash(name: string, config?: CallOverrides): Promise<BytesLike>;

  getNameHash(name: string, config?: CallOverrides): Promise<string>;

  getRecipientMessageBlockListLength(
    recipientHash: BytesLike,
    config?: CallOverrides
  ): Promise<number>;

  batchRecipientMessageBlock(
    recipientHash: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<number>>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  createMessage(
    recipientHash: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.MessageCreatedEvent>;

  createMessageWithData(
    recipientHash: BytesLike,
    content: string,
    data: BytesLike,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.MessageCreatedEvent>;

  uploadData(
    nameHash: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgradeModel.DataUploadedEvent>;

  /* ================ LISTEN FUNCTIONS ================ */

  listenMessageCreatedEvent(callback: Function): Promise<void>;

  getMessageCreatedEventList(
    sender: string | undefined,
    receiptHash: BytesLike | undefined,
    from: number,
    to: number
  ): Promise<Array<BlockChatUpgradeModel.MessageCreatedEvent>>;

  getDataUploadedEvent(
    dataHash: BytesLike,
    from: number,
    to: number
  ): Promise<BlockChatUpgradeModel.DataUploadedEvent>;

  /* ================ UTILS FUNCTIONS ================ */

  recipientHash(name: string): string;

  nameHash(name: string): string;

  dataHash(address: string, name: string): string;
}
