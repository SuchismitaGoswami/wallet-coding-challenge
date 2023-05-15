/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column({ type: 'double', nullable: false, name: 'amount' })
  amount: number;

  @Column({ type: 'varchar', nullable: true, name: 'description' })
  description: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdDate: Date;

  @BeforeInsert()
  @BeforeRemove()
  @BeforeUpdate()
  updateWalletUpdatedDate() {
    if (this.wallet) {
      this.wallet.updatedDate = new Date();
    }
  }
}
