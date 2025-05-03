import { Transaction } from '@/domain/Account/entities/Transaction';
import { ITransactionRepository } from '@/domain/Account/repositories/ITransactionRepository';

export class TransactionRepositoryInMemory implements ITransactionRepository {
  transactions: Transaction[] = [];

  async findByIdAndUserId(id: string, userId: string) {
    const transaction = this.transactions.find(
      (t) => t.id.getValue() === id && t.userId.getValue() === userId,
    );
    return transaction;
  }

  async create(transaction: Transaction) {
    this.transactions.push(transaction);
    return transaction;
  }

  async save(transaction: Transaction) {
    const index = this.transactions.findIndex((t) => t.id.getValue() === transaction.id.getValue());
    if (index !== -1) {
      this.transactions[index] = transaction;
    }
  }
}
