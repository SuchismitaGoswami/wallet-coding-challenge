import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './wallet-transaction.entity';

@Entity({ name: 'wallet' })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'double', nullable: false, name: 'balance' })
  balance: number;

  @Column({ type: 'varchar', nullable: false, name: 'name' })
  name: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedDate: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
