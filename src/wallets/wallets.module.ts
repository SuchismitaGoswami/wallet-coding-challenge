import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletsController } from './controllers/wallets.controller';
import { WalletsService } from './services/wallets.service';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/wallet-transaction.entity';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletsController],
  providers: [WalletsService, TransactionsService],
})
export class WalletsModule {}
