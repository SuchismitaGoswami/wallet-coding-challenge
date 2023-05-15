import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entities/wallet.entity';
import { CreateTransactionRequestDto } from '../dtos/create-transaction-request.dto';
import { TransactionWithWalletInfo } from '../types/transaction-with-walletinfo.type';
import { WalletsService } from './wallets.service';
import { Transaction } from '../entities/wallet-transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => WalletsService))
    private readonly walletService: WalletsService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(
    id: string,
    content: Partial<CreateTransactionRequestDto>,
  ): Promise<TransactionWithWalletInfo<Transaction>> {
    const wallet: Wallet = await this.walletService.fetchWallet(id);

    if (wallet === null)
      throw new NotFoundException(`No wallet found with id: ${id}`);

    if (content.amount < 0 && wallet.balance < Math.abs(content.amount))
      throw new BadRequestException('Insufficient balance in the wallet');

    try {
      return await this.dataSource.transaction(async (manager) => {
        const transaction = manager.create(Transaction, content) as Transaction;
        transaction.wallet = wallet;
        const createdTransaction = await manager.save(transaction);
        wallet.balance += content.amount;
        await manager.save(wallet);
        return {
          ...createdTransaction,
          balance: wallet.balance,
          walletId: wallet.id,
        } as TransactionWithWalletInfo<Transaction>;
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchTransactions(
    id: string,
  ): Promise<TransactionWithWalletInfo<Transaction>[]> {
    const wallet: Wallet = await this.walletService.fetchWallet(id);

    if (wallet === null)
      throw new NotFoundException(`No wallet found with id: ${id}`);

    try {
      return (await this.transactionRepository
        .createQueryBuilder('transaction')
        .select(['wallet.id', 'wallet.balance'])
        .leftJoin('transaction.wallet', 'wallet')
        .select([
          'transaction.id AS id',
          'transaction.amount AS amount',
          'transaction.createdDate as createdDate',
          'transaction.description as description',
          'wallet.id as walletId',
          'wallet.balance AS balance',
        ])
        .where('wallet.id = :id', { id })
        .getRawMany()) as TransactionWithWalletInfo<Transaction>[];
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
