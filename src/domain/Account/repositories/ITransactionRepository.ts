import { Transaction } from '@/domain/Account/entities/Transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  save(transaction: Transaction): Promise<void>;
  findByIdAndUserId(id: string, userId: string): Promise<Transaction | undefined>;
}
