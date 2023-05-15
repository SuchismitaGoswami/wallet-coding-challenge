export type TransactionWithWalletInfo<T> = T & {
  balance: number;
  walletId: string;
};
