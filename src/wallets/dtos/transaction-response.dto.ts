import { Expose } from 'class-transformer';

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  walletId: string;

  @Expose()
  amount: number;

  @Expose()
  balance: number;

  @Expose()
  createdDate: Date;

  @Expose()
  description: string;
}
