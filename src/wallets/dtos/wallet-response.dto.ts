import { Exclude, Expose } from 'class-transformer';

export class WalletResponseDto {
  @Expose()
  id: string;

  @Expose()
  balance: number;

  @Expose()
  name: string;

  @Expose()
  createdDate: Date;

  @Exclude()
  updatedDate: Date;
}
