import { Wallet } from 'src/wallets/entities/wallet.entity';

export const walletStub = (name: string, balance: number): Wallet => {
  return {
    balance: balance,
    name: name,
    id: 'test-id',
    createdDate: new Date(),
    updatedDate: new Date(),
  } as Wallet;
};
