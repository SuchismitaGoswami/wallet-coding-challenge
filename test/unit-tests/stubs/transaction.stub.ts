import { Transaction } from 'src/wallets/entities/wallet-transaction.entity';
import { TransactionWithWalletInfo } from 'src/wallets/types/transaction-with-walletinfo.type';

export const transactionStub = (
  id: string,
  prevWalletBalance: number,
  transactionInfo: { amount: number; description?: string },
): Partial<TransactionWithWalletInfo<Transaction>> => {
  return {
    id: 'test-transaction-id',
    amount: transactionInfo.amount,
    walletId: id,
    createdDate: new Date(),
    balance: transactionInfo.amount + prevWalletBalance,
  } as TransactionWithWalletInfo<Transaction>;
};
