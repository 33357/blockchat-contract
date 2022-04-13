import { BigNumber, BytesLike, CallOverrides, PayableOverrides, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface BlockChatUpgradeableClient {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  implementationVersion(config?: CallOverrides): Promise<string>;

  getGroupHash(name: string, config?: CallOverrides): Promise<BytesLike>;

  getSenderMessageListLength(sender: string, config?: CallOverrides): Promise<BigNumber>;

  getRecipientMessageListLength(recipient: BytesLike, config?: CallOverrides): Promise<BigNumber>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  createMessage(recipient: BytesLike, content: string, config?: PayableOverrides, callback?: Function): Promise<void>;

}
