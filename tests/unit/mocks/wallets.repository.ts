/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial, Repository } from 'typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { walletStub } from '../stubs/wallet.stub';

export const mockWalletsRepository: Partial<Repository<Wallet>> = {
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

  findOneBy: jest
    .fn()
    .mockImplementation((where: Partial<Wallet>): Promise<Wallet> => {
      return Promise.resolve({
        ...walletStub('test-wallet', 100),
        id: where.id,
      });
    }),
};
