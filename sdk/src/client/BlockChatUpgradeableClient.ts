import {
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import {
  Message,
  MessageCreatedEvent,
  MessageToRecipientList,
  MessageToRecipientListCreatedEvent
} from '../model';

export interface BlockChatUpgradeableClient {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  implementationVersion(config?: CallOverrides): Promise<string>;

  getRecipientHash(name: string, config?: CallOverrides): Promise<BytesLike>;

  getSenderMessageListLength(
    sender: string,
    config?: CallOverrides
  ): Promise<BigNumber>;

  getRecipientMessageListLength(
    recipient: BytesLike,
    config?: CallOverrides
  ): Promise<BigNumber>;

  messageLength(config?: CallOverrides): Promise<BigNumber>;

  senderMessageListMap(
    sender: string,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumber>;

  recipientMessageListMap(
    recipient: BytesLike,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumber>;

  messageMap(messageId: BigNumberish, config?: CallOverrides): Promise<Message>;

  batchSenderMessageId(
    sender: string,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumber>>;

  batchRecipientMessageId(
    recipient: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumber>>;

  batchMessage(
    messageIdList: Array<BigNumberish>,
    config?: CallOverrides
  ): Promise<[Array<Message>, Array<MessageToRecipientList>]>;

  publicKeyMap(
    address: string,
    config?: CallOverrides
  ): Promise<string>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  createMessage(
    recipient: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<MessageCreatedEvent>;

  uploadPublicKey(
    publicKey: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  createMessageToRecipientList(
    recipientList: Array<BytesLike>,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<MessageToRecipientListCreatedEvent>;

  /* ================ LISTEN FUNCTIONS ================ */

  listenMessage(callback: Function): Promise<void>;

  /* ================ UTILS FUNCTIONS ================ */

  recipientHash(name: string): BytesLike;
}
