/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { WalletsService } from '../services/wallets.service';
import { CreateWalletRequestDto } from '../dtos/create-wallet-request.dto';
import { ClassSerializerInterceptor } from '../../interceptors/serialize.interceptor';
import { WalletResponseDto } from '../dtos/wallet-response.dto';
import { CreateTransactionRequestDto } from '../dtos/create-transaction-request.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';
import { TransactionsService } from '../services/transactions.service';

@Controller('wallet')
export class WalletsController {
  constructor(
    private readonly walletService: WalletsService,
    private readonly transactionService: TransactionsService,
  ) {}

  @UseInterceptors(new ClassSerializerInterceptor(WalletResponseDto))
  @Post('/')
  async createWallet(@Body() content: CreateWalletRequestDto) {
    const wallet = await this.walletService.createWallet(
      content.name,
      content.balance,
    );
    return wallet;
  }

  @UseInterceptors(new ClassSerializerInterceptor(WalletResponseDto))
  @Get('/:walletId')
  async fetchWallet(@Param('walletId') id: string) {
    return await this.walletService.fetchWallet(id);
  }

  @UseInterceptors(new ClassSerializerInterceptor(TransactionResponseDto))
  @Post('/:walletId/transactions')
  async createTransaction(
    @Param('walletId') id: string,
    @Body() content: CreateTransactionRequestDto,
  ) {
    return await this.transactionService.createTransaction(id, content);
  }

  @UseInterceptors(new ClassSerializerInterceptor(TransactionResponseDto))
  @Get('/:walletId/transactions')
  async fetchTransanctionList(@Param('walletId') id: string) {
    return await this.transactionService.fetchTransactions(id);
  }
}
