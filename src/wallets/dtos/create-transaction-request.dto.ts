import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTransactionRequestDto {
  @IsString({ message: 'The description must be a string' })
  @IsOptional()
  description: string;

  @IsNumber(
    {},
    { message: 'The amount to be deposited or withdrawn must be a number' },
  )
  @IsNotEmpty({ message: 'The amount is a required field' })
  amount: number;
}
