import { Test, TestingModule } from '@nestjs/testing';
import { mockTranscationsRepository } from './mocks/transactions.repository';

import { mockWalletsService } from './mocks/wallets.service';
import {
  entityManagerMock,
  mockDataSource,
} from './mocks/connection.datasource';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WalletsService } from '../../src/wallets/services/wallets.service';
import { TransactionsService } from '../../src/wallets/services/transactions.service';
import { Transaction } from '../../src/wallets/entities/wallet-transaction.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Wallet } from 'src/wallets/entities/wallet.entity';

describe('TransactionsService', () => {
  let transactionService: TransactionsService;
  let walletsService: WalletsService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
     //cleanup actions
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        WalletsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTranscationsRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    })
      .overrideProvider(WalletsService)
      .useValue(mockWalletsService)
      .compile();

    transactionService = module.get<TransactionsService>(TransactionsService);
    walletsService = module.get<WalletsService>(WalletsService);
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  describe('service_init', () => {
    it('should be defined', () => {
      expect(transactionService).toBeDefined();
    });
  });

  describe('transactionRepository_init', () => {
    it('should be defined', () => {
      expect(transactionRepository).toBeDefined();
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction transactions against a wallet', async () => {
      const wallet_id = 'valid-id';
      const requestDTO = { amount: 100, description: 'Valid Transaction' };
      const response = await transactionService.createTransaction(
        wallet_id,
        requestDTO,
      );
      expect(response).toEqual({
        ...requestDTO,
        walletId: expect.any(String),
        balance: expect.any(Number),
      });
      expect(walletsService.fetchWallet).toHaveBeenCalledWith(wallet_id);
      expect(entityManagerMock.create).toHaveBeenCalled();
    });

    it('should raise wallet not found exception', async () => {
      const wallet_id = 'valid-id';
      const requestDTO = { amount: 100, description: 'Valid Transaction' };
      jest
        .spyOn(walletsService, 'fetchWallet')
        .mockReturnValue(Promise.resolve(null));
      await expect(
        transactionService.createTransaction(wallet_id, requestDTO),
      ).rejects.toThrow(NotFoundException);
    });

    it('should raise BadRequestException (insufficient balance) exception', async () => {
      const wallet_id = 'valid-id';
      const requestDTO = {
        amount: -100000,
        description: 'Invalid Transaction',
      };
      jest
        .spyOn(walletsService, 'fetchWallet')
        .mockReturnValue(Promise.resolve({ balance: 100 } as Wallet));
      await expect(
        transactionService.createTransaction(wallet_id, requestDTO),
      ).rejects.toThrow(BadRequestException);
    });

    it('should raise InternalServerErrorException', async () => {
      const wallet_id = 'valid-id';
      const requestDTO = {
        amount: -100000,
        description: 'Invalid Transaction',
      };
      jest
        .spyOn(walletsService, 'fetchWallet')
        .mockReturnValue(Promise.resolve({ balance: 100 } as Wallet));
      await expect(
        transactionService.createTransaction(wallet_id, requestDTO),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
