import { BigNumber, BytesLike } from 'ethers';

export interface Message {
  messageHash: BytesLike;
  createBlock: number;
}

export interface MessageCreatedEvent {
  messageId: number;
  createDate: number;
  sender: string;
  recipientList: Array<BytesLike>;
  content: string;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
