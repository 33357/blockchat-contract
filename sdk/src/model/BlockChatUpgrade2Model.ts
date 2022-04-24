import { BigNumber, BytesLike } from 'ethers';

export interface Message {
  messageHash: BytesLike;
  createBlock: BigNumber;
}

export interface MessageCreatedEvent {
  messageId: BigNumber;
  sender: string;
  recipientList: Array<BytesLike>;
  content: string;
  createDate: BigNumber;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
