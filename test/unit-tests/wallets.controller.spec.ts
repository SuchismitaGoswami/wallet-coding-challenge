import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from '../../src/wallets/controllers/wallets.controller';
import { WalletsService } from '../../src/wallets/services/wallets.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockWalletsService } from './mocks/wallets.service';
import { TransactionsService } from '../../src/wallets/services/transactions.service';
import { mockTransactionsService } from './mocks/transactions.service';

describe('WalletsController', () => {
  let controller: WalletsController;
  let walletService: WalletsService;
  let transactionService: TransactionsService;

  beforeEach(async () => {
    //cleanup actions
    jest.clearAllMocks();

    //create mock module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [WalletsService, TransactionsService],
    })
      .overrideProvider(WalletsService)
      .useValue(mockWalletsService)
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsService)
      .compile();

    controller = module.get<WalletsController>(WalletsController);
    walletService = module.get<WalletsService>(WalletsService);
    transactionService = module.get<TransactionsService>(TransactionsService);
  });

  describe('controller_init', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('wallet service_init', () => {
    it('should be defined', () => {
      expect(walletService).toBeDefined();
    });
  });

  describe('transaction service_init', () => {
    it('should be defined', () => {
      expect(transactionService).toBeDefined();
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const requestDTO = {
        name: 'test-wallet',
        balance: 100,
      };
      const result = await controller.createWallet(requestDTO);
      expect(result).toBeDefined();
      expect(walletService.createWallet).toHaveBeenCalledWith(
        requestDTO.name,
        requestDTO.balance,
      );
      expect(result.balance).toEqual(100);
      expect(result.name).toEqual('test-wallet');
    });
  });

  describe('fetchWallet', () => {
    it('should fetch the wallet info', async () => {
      const requestDTO = { id: 'valid-id' };
      const result = await controller.fetchWallet(requestDTO.id);
      expect(result).toBeDefined();
      expect(walletService.fetchWallet).toHaveBeenCalledWith(requestDTO.id);
      expect(result.id).toEqual('valid-id');
    });

    it('should raise not found wallet exception', async () => {
      const requestDTO = { id: 'invalid-id' };
      jest
        .spyOn(walletService, 'fetchWallet')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.fetchWallet(requestDTO.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('fetchTransanctionList', () => {
    it('should return the list of transactions against a wallet', async () => {
      const requestDTO = { id: 'valid-id' };
      const result = await controller.fetchTransanctionList(requestDTO.id);
      expect(result).toBeDefined();
      expect(transactionService.fetchTransactions).toHaveBeenCalledWith(
        requestDTO.id,
      );
      expect(result.length).toEqual(1);
      expect(result[0].walletId).toEqual(requestDTO.id);
    });

    it('should return the list of transactions against a wallet', async () => {
      const requestDTO = { id: 'invalid-id' };
      jest
        .spyOn(transactionService, 'fetchTransactions')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.fetchTransanctionList(requestDTO.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction against a wallet and add balance to wallet', async () => {
      const walletID = 'valid-id';
      const requestDTO = { amount: 100, description: 'New Transaction' };
      const result = await controller.createTransaction(walletID, requestDTO);
      expect(result).toBeDefined();
      expect(transactionService.createTransaction).toHaveBeenCalledWith(
        walletID,
        requestDTO,
      );
      expect(result.walletId).toEqual(walletID);
      expect(result.amount).toEqual(requestDTO.amount);
      expect(result.balance).toBeGreaterThanOrEqual(requestDTO.amount);
    });

    it('should create a transaction against a wallet and deduct balance from wallet', async () => {
      const walletID = 'valid-id';
      const requestDTO = { amount: -100, description: 'New Transaction' };
      const result = await controller.createTransaction(walletID, requestDTO);
      expect(result).toBeDefined();
      expect(transactionService.createTransaction).toHaveBeenCalledWith(
        walletID,
        requestDTO,
      );
      expect(result.walletId).toEqual(walletID);
      expect(result.amount).toEqual(requestDTO.amount);
      expect(result.balance).toBeGreaterThanOrEqual(requestDTO.amount);
    });

    it('should raise not found wallet exception', async () => {
      const requestDTO = {
        amount: 1,
        description: 'Invalid transaction',
      };
      const wallet_id = 'invalid-id';
      jest
        .spyOn(transactionService, 'createTransaction')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.createTransaction(wallet_id, requestDTO),
      ).rejects.toThrow(NotFoundException);
    });

    it('should raise BadRequestException(insuffient balance) Exception', async () => {
      const requestDTO = { id: 'valid-id' };
      jest
        .spyOn(transactionService, 'createTransaction')
        .mockRejectedValue(new BadRequestException('Insufficent balance'));
      await expect(
        controller.createTransaction(requestDTO.id, {
          amount: 100000000000000,
          description: 'Invalid transaction',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
