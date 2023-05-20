import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from '../../src/wallets/entities/wallet.entity';
import { WalletsService } from '../../src/wallets/services/wallets.service';
import { mockWalletsRepository } from './mocks/wallets.repository';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('WalletsService', () => {
  let service: WalletsService;
  let walletRepository: Repository<Wallet>;

  beforeEach(async () => {
     //cleanup actions
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletsRepository,
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    walletRepository = module.get<Repository<Wallet>>(
      getRepositoryToken(Wallet),
    );
  });

  describe('service_init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
      const requestDTO: Partial<Wallet> = {
        name: 'test-wallet',
        balance: 100,
      };
      const response = await service.createWallet(
        requestDTO.name,
        requestDTO.balance,
      );
      expect(response).toBeDefined();
      expect(walletRepository.create).toHaveBeenCalledWith(requestDTO);
      expect(response).toEqual({
        ...requestDTO,
        id: expect.any(String),
        createdDate: expect.any(Date),
        updatedDate: expect.any(Date),
      });
    });
  });

  describe('fetchWallet', () => {
    it('should fetch the wallet info', async () => {
      const requestDTO = { id: 'valid-id' };
      const response = await service.fetchWallet(requestDTO.id);
      expect(response).toBeDefined();
      expect(walletRepository.findOneBy).toHaveBeenCalledWith(requestDTO);
      expect(response).toEqual({
        ...requestDTO,
        createdDate: expect.any(Date),
        updatedDate: expect.any(Date),
        name: expect.any(String),
        balance: expect.any(Number),
      });
    });

    it('should raise not found wallet exception', async () => {
      const requestDTO = { id: 'invalid-id' };
      jest
        .spyOn(walletRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(null));
      await expect(service.fetchWallet(requestDTO.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
