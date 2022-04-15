import {
  BigNumberish,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Message, MessageCreatedEvent } from '../model';

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
  ): Promise<BigNumberish>;

  getRecipientMessageListLength(
    recipient: BytesLike,
    config?: CallOverrides
  ): Promise<BigNumberish>;

  messageLength(config?: CallOverrides): Promise<BigNumberish>;

  senderMessageListMap(
    sender: string,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumberish>;

  recipientMessageListMap(
    recipient: BytesLike,
    index: BigNumberish,
    config?: CallOverrides
  ): Promise<BigNumberish>;

  messageMap(messageId: BigNumberish, config?: CallOverrides): Promise<Message>;

  batchSenderMessageId(
    sender: string,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumberish>>;

  batchRecipientMessageId(
    recipient: BytesLike,
    start: BigNumberish,
    length: BigNumberish,
    config?: CallOverrides
  ): Promise<Array<BigNumberish>>;

  batchMessage(
    messageIdList: Array<BigNumberish>,
    config?: CallOverrides
  ): Promise<Array<Message>>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  createMessage(
    recipient: BytesLike,
    content: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<MessageCreatedEvent>;

  /* ================ LISTEN FUNCTIONS ================ */

  listenMessage(callback: Function): Promise<void>;
}
