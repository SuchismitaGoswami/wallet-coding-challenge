import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateWalletRequestDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is a required field' })
  name: string;

  @IsPositive({ message: 'opening balance can not negative' })
  @IsNumber({}, { message: 'balance must be a number' })
  @IsNotEmpty({ message: 'balance is a required field' })
  balance: number;
}
