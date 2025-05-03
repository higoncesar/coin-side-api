import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateTransactionUseCase } from '..';
import { TransactionType } from '@/domain/Account/enums/TransactionType';
import { AccountNotFoundError } from '@/domain/Account/exceptions/AccountNotFoundError';
import { IAccountRepository } from '@/domain/Account/repositories/IAccountRepository';
import { ITransactionRepository } from '@/domain/Account/repositories/ITransactionRepository';
import { CategoryNotFoundError } from '@/domain/Category/exceptions/CategoryNotFoundError';
import { InvalidCategoryTypeError } from '@/domain/Category/exceptions/InvalidCategoryTypeError';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';
import { AccountRepositoryInMemory } from '@/infraestructure/database/repositories/memory/AccountRepositoryInMemory';
import { CategoryRepositoryInMemory } from '@/infraestructure/database/repositories/memory/CategoryRepositoryInMemory';
import { TransactionRepositoryInMemory } from '@/infraestructure/database/repositories/memory/TransactionRepositoryInMemory';
import { makeAccount } from '@/tests-utils/factories/MakeAccount';
import { makeIncomeCategory } from '@/tests-utils/factories/MakeCategory';
import { makeUser } from '@/tests-utils/factories/MakeUser';

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let accountRepository: IAccountRepository;
  let transactionRepository: ITransactionRepository;
  let categoryRepository: ICategoryRepository;

  beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    transactionRepository = new TransactionRepositoryInMemory();
    categoryRepository = new CategoryRepositoryInMemory();
    createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
      categoryRepository,
    );
  });

  it('should create a transaction', async () => {
    const user = makeUser();
    const userId = user.id.getValue();
    const account = makeAccount({ userId });
    const category = makeIncomeCategory({ userId });

    await accountRepository.create(account);
    await categoryRepository.create(category);

    const transaction = await createTransactionUseCase.execute({
      userId,
      accountId: account.id.getValue(),
      type: TransactionType.INCOME,
      amount: 100,
      description: faker.lorem.words(2),
      dueDate: new Date(),
      paymentDate: new Date(),
      categoryId: category.id.getValue(),
    });

    const transactionCreated = await transactionRepository.findByIdAndUserId(
      transaction.id,
      userId,
    );

    expect(transactionCreated?.toPrimitive()).toStrictEqual(transaction);
  });

  it('should throw an error if the account is not found', async () => {
    const user = makeUser();
    const userId = user.id.getValue();
    const account = makeAccount({ userId });
    const category = makeIncomeCategory({ userId });

    await accountRepository.create(account);
    await categoryRepository.create(category);

    await expect(
      createTransactionUseCase.execute({
        userId,
        accountId: faker.string.uuid(), //ramdom account id
        type: TransactionType.INCOME,
        amount: 100,
        description: faker.lorem.words(2),
        dueDate: new Date(),
        categoryId: category.id.getValue(),
      }),
    ).rejects.toThrow(AccountNotFoundError);
  });

  it('should throw an error if the category is not found', async () => {
    const user = makeUser();
    const userId = user.id.getValue();
    const account = makeAccount({ userId });
    const category = makeIncomeCategory({ userId });

    await accountRepository.create(account);
    await categoryRepository.create(category);

    await expect(
      createTransactionUseCase.execute({
        userId,
        accountId: account.id.getValue(),
        type: TransactionType.INCOME,
        amount: 100,
        description: faker.lorem.words(2),
        dueDate: new Date(),
        categoryId: faker.string.uuid(), //random category id
      }),
    ).rejects.toThrow(CategoryNotFoundError);
  });

  it('should throw an error if the category is not the same type as the transaction', async () => {
    const user = makeUser();
    const userId = user.id.getValue();
    const account = makeAccount({ userId });
    const category = makeIncomeCategory({ userId });

    await accountRepository.create(account);
    await categoryRepository.create(category);

    await expect(
      createTransactionUseCase.execute({
        userId,
        accountId: account.id.getValue(),
        type: TransactionType.EXPENSE,
        amount: 100,
        description: faker.lorem.words(2),
        dueDate: new Date(),
        categoryId: category.id.getValue(),
      }),
    ).rejects.toThrow(InvalidCategoryTypeError);
  });
});
