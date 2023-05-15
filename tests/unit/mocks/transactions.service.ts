import { TransactionsService } from 'src/wallets/services/transactions.service';
import { transactionStub } from '../stubs/transaction.stub';

export const mockTransactionsService: Partial<TransactionsService> = {
  fetchTransactions: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve([
      {
        ...transactionStub(id, 1000, { amount: 100 }),
        walletId: id,
      },
    ]);
  }),

  createTransaction: jest
    .fn()
    .mockImplementation(
      (
        id: string,
        transactionInfo: { amount: number; description?: string },
      ) => {
        return Promise.resolve(
          transactionStub(id, 1000, {
            amount: transactionInfo.amount,
            description: transactionInfo.description,
          }),
        );
      },
    ),
};
