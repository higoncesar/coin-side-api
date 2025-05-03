import { Account } from '@/domain/Account/entities/Account';

export interface IAccountRepository {
  findByIdAndUserId(id: string, userId: string): Promise<Account | undefined>;
  findByNameAndUserId(name: string, userId: string): Promise<Account | undefined>;
  findDefaultAccount(userId: string): Promise<Account | undefined>;
  getAllByUserId(userId: string): Promise<Account[]>;
  create(account: Account): Promise<Account>;
  save(account: Account): Promise<void>;
}
