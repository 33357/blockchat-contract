import { BytesLike } from 'ethers';

export interface MessageCreatedEvent {
  sender: string;
  recipientHash: BytesLike;
  createDate: number;
  content: string;
}

export interface DataUploadedEvent {
  dataHash: BytesLike;
  content: string;
}

export { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
