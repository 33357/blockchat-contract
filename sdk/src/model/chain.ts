import { BigNumber, BigNumberish, BytesLike } from 'ethers';

export interface Message {
  sender: string;
  recipient: BytesLike;
  content: string;
  createDate: BigNumberish;
}

export interface MessageCreatedEvent {
  messageId: BigNumberish;
  sender: string;
  recipient: BytesLike;
  createDate: BigNumberish;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
