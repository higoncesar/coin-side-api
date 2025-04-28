import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateAccountUseCase } from '..';
import { AccountAlreadyExistsError } from '@/domain/exceptions/AccountAlreadyExistsError';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { AccountRepositoryInMemory } from '@/infraestructure/database/repositories/memory/AccountRepositoryInMemory';
import { makeAccount } from '@/tests/factories/MakeAccount';

describe('CreateAccountUseCase', () => {
  let accountRepository: IAccountRepository;
  let createAccountUseCase: CreateAccountUseCase;

  beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    createAccountUseCase = new CreateAccountUseCase(accountRepository);
  });

  it('should create an account', async () => {
    const props = {
      name: faker.finance.accountName(),
      type: 'BANK',
      userId: faker.string.uuid(),
      isDefault: false,
      initialBalance: 0,
    };

    const account = await createAccountUseCase.execute(props);

    const createdAccount = await accountRepository.findById(account.id, props.userId);

    expect(createdAccount).toBeDefined();
    expect(createdAccount?.name).toBe(props.name);
    expect(createdAccount?.type).toBe(props.type);
    expect(createdAccount?.userId.getValue()).toBe(props.userId);
    expect(createdAccount?.isDefault).toBe(props.isDefault);
    expect(createdAccount?.initialBalance.getValue()).toBe(props.initialBalance);
  });

  it('should not create an account with the same name', async () => {
    const account = makeAccount({ isDefault: false });
    await accountRepository.create(account);

    const props = {
      name: account.name,
      type: account.type,
      userId: account.userId.getValue(),
      isDefault: account.isDefault,
      initialBalance: account.initialBalance.getValue(),
    };

    await expect(createAccountUseCase.execute(props)).rejects.toThrow(AccountAlreadyExistsError);
  });

  it('should replace the old default account when the new account is default', async () => {
    const account = makeAccount({ isDefault: true });
    await accountRepository.create(account);

    const userId = account.userId.getValue();

    const props = {
      name: faker.finance.accountName(),
      type: 'BANK',
      userId,
      isDefault: true,
      initialBalance: 0,
    };

    const newDefaultAccount = await createAccountUseCase.execute(props);

    const oldDefaultAccount = await accountRepository.findById(account.id.getValue(), userId);
    const createdNewDefaultAccount = await accountRepository.findById(newDefaultAccount.id, userId);

    expect(oldDefaultAccount?.isDefault).toBeFalsy();
    expect(createdNewDefaultAccount?.isDefault).toBeTruthy();
  });
});
