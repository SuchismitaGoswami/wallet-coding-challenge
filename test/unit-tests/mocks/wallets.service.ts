import { WalletsService } from 'src/wallets/services/wallets.service';
import { walletStub } from '../stubs/wallet.stub';

export const mockWalletsService: Partial<WalletsService> = {
  createWallet: jest
    .fn()
    .mockImplementation((name: string, balance: number) => {
      return Promise.resolve(walletStub(name, balance));
    }),

  fetchWallet: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({
      ...walletStub('test', 100),
      id,
    });
  }),
};
