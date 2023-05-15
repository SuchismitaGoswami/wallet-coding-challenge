import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(name: string, balance: number): Promise<Wallet> {
    try {
      const wallet = this.walletRepository.create({
        name: name,
        balance: balance,
      });
      return await this.walletRepository.save(wallet);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchWallet(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOneBy({ id });
    if (wallet == null)
      throw new NotFoundException(`No wallet found with id: ${id}`);
    return wallet;
  }
}
