import { Account } from '@/domain/entities/Account';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class AccountRepositoryInMemory implements IAccountRepository {
  accounts: Account[] = [];

  async findById(id: string) {
    const account = this.accounts.find((account) => account.id.getValue() === id);
    return account;
  }

  async getAllByUserId(userId: string) {
    const account = this.accounts.filter((account) => account.userId.getValue() === userId);
    return account;
  }

  async findByName(name: string, userId: string) {
    const account = this.accounts.find(
      (account) => account.name === name && account.userId.getValue() === userId,
    );
    return account;
  }

  async findDefaultAccount(userId: string) {
    const account = this.accounts.find(
      (account) => account.userId.getValue() === userId && account.isDefault,
    );
    return account;
  }

  async create(account: Account) {
    this.accounts.push(account);
    return account;
  }

  async save(account: Account) {
    const index = this.accounts.findIndex((a) => a.id.getValue() === account.id.getValue());
    if (index !== -1) {
      this.accounts[index] = account;
    }
  }
}
