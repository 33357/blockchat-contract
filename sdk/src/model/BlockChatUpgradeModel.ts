import { BytesLike } from 'ethers';

export interface MessageCreatedEvent {
  hash: string;
  sender: string;
  recipientHash: BytesLike;
  createDate: number;
  content: string;
}

export interface DataUploadedEvent {
  hash: string;
  dataHash: BytesLike;
  content: string;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
