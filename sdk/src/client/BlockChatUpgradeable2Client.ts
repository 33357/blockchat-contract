import {
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import { BlockChatUpgrade2Model } from '../model';

export interface BlockChatUpgradeable2Client {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  implementationVersion(config?: CallOverrides): Promise<string>;

  getRecipientHash(name: string, config?: CallOverrides): Promise<BytesLike>;

  getMessageHash(
    sender: string,
    createDate: BigNumberish,
    createBlock: BigNumberish,
    recipientList: Array<BytesLike>,
    content: string,
    config?: CallOverrides
  ): Promise<string>;

  getRecipientMessageListLength(
    recipient: BytesLike,
    config?: CallOverrides
  ): Promise<number>;

  messageLength(config?: CallOverrides): Promise<number>;

  recipientMessageListMap(
    recipient: BytesLike,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<number>;

  messageMap(
    messageId: BigNumberish,
    config?: CallOverrides
  ): Promise<BlockChatUpgrade2Model.Message>;

  batchRecipientMessageId(
    recipient: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<number>>;

  batchMessage(
    messageIdList: Array<BigNumberish>,
    config?: CallOverrides
  ): Promise<Array<BlockChatUpgrade2Model.Message>>;

  publicKeyMap(address: string, config?: CallOverrides): Promise<string>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  uploadPublicKey(
    publicKey: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  createMessage(
    recipientList: Array<BytesLike>,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<BlockChatUpgrade2Model.MessageCreatedEvent>;

  /* ================ LISTEN FUNCTIONS ================ */

  listenMessage(callback: Function): Promise<void>;

  /* ================ UTILS FUNCTIONS ================ */

  recipientHash(name: string): BytesLike;

  messageHash(
    sender: string,
    recipientList: Array<BytesLike>,
    content: string,
    createDate: BigNumberish
  ): BytesLike;
}
