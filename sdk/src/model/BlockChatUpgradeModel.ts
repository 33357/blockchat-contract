import { BytesLike } from 'ethers';

export interface MessageCreatedEvent {
  blockHash: string;
  sender: string;
  recipientHash: BytesLike;
  createDate: number;
  content: string;
}

export interface DataUploadedEvent {
  blockHash: string;
  dataHash: BytesLike;
  content: string;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
