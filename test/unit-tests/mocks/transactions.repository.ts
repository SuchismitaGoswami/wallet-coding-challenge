/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial, Repository, Transaction } from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { walletStub } from '../stubs/wallet.stub';

export const mockTranscationsRepository: Partial<Repository<Transaction>> = {
  create: jest
    .fn()
    .mockImplementation((entityLike: DeepPartial<Wallet>): Wallet => {
      return entityLike as Wallet;
    }),

  save: jest.fn().mockImplementation((entity: Wallet): Promise<Wallet> => {
    const stub = walletStub(entity.name, entity.balance);
    return Promise.resolve({
      ...entity,
      id: stub.id,
      createdDate: stub.createdDate,
      updatedDate: stub.updatedDate,
    });
  }),
};
