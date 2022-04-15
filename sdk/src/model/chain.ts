import { BigNumber, BytesLike } from 'ethers';

export interface Message {
  sender: string;
  recipient: BytesLike;
  content: string;
  createDate: BigNumber;
}

export interface MessageCreatedEvent {
  messageId: BigNumber;
  sender: string;
  recipient: BytesLike;
  createDate: BigNumber;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
