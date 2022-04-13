import { BigNumber, BigNumberish, BytesLike, CallOverrides, PayableOverrides, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface Message {
  sender: string;
  recipient: BytesLike;
  content: string;
  createDate: BigNumber;
}

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

  getSenderMessageListLength(sender: string, config?: CallOverrides): Promise<BigNumber>;

  getRecipientMessageListLength(recipient: BytesLike, config?: CallOverrides): Promise<BigNumber>;

  messageLength(config?: CallOverrides): Promise<BigNumber>;

  senderMessageListMap(sender: string, index: BigNumberish, config?: CallOverrides): Promise<BigNumber>;

  recipientMessageListMap(recipient: BytesLike, index: BigNumberish, config?: CallOverrides): Promise<BigNumber>;

  messageMap(messageId: BigNumberish, config?: CallOverrides): Promise<Message>;

  /* ================ PAYABLE FUNCTIONS ================ */

  createMessage( recipient: BytesLike, content: string, config?: PayableOverrides, callback?: Function): Promise<void>;
}
