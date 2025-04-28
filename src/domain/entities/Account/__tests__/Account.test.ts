import { faker } from '@faker-js/faker/locale/pt_BR';
import { expect, describe, it } from 'vitest';
import { AccountType } from '../enums/AccountType';
import { TransactionStatus } from '../enums/TransactionStatus';
import { TransactionType } from '../enums/TransactionType';
import { TransactionDoesNotBelongToAccountError } from '@/domain/exceptions/TransactionDoesNotBelongToAccountError';
import { CreateAccountFactoryProps } from '@/domain/factories/AccountFactory';
import { DomainDate } from '@/domain/value-object/DomainDate';

import { makeAccount } from '@/tests/factories/MakeAccount';

import { makeIncomeCategory, makeExpenseCategory } from '@/tests/factories/MakeCategory';
import { makeTransaction } from '@/tests/factories/MakeTransaction';

describe('Account', () => {
  const defaultProps: CreateAccountFactoryProps = {
    userId: faker.string.uuid(),
    name: faker.finance.accountName(),
    type: AccountType.BANK,
    isDefault: false,
    isActive: true,
    initialBalance: 0,
    createdAt: faker.date.past().getTime(),
  };

  const incomeCategory = makeIncomeCategory();
  const expenseCategory = makeExpenseCategory();

  const now = DomainDate.now();

  describe('Creation', () => {
    it('should create an account with default values', () => {
      const account = makeAccount(defaultProps);

      expect(account.userId.getValue()).toBe(defaultProps.userId);
      expect(account.name).toBe(defaultProps.name);
      expect(account.type).toBe(defaultProps.type);
      expect(account.isDefault).toBe(defaultProps.isDefault);
      expect(account.isActive).toBe(defaultProps.isActive);
      expect(account.balance.getValue()).toBe(defaultProps.initialBalance);
      expect(account.initialBalance.getValue()).toBe(defaultProps.initialBalance);
      expect(account.createdAt.getTime()).toBe(defaultProps.createdAt);
    });
  });

  describe('Balance Calculation', () => {
    it('should calculate balance correctly with multiple transactions', () => {
      const account = makeAccount(defaultProps);

      const income = makeTransaction({
        accountId: account.id.getValue(),
        amount: 1000,
        type: TransactionType.INCOME,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      const expense = makeTransaction({
        accountId: account.id.getValue(),
        amount: 500,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        description: 'Rent',
        categoryId: expenseCategory.id.getValue(),
      });

      account.addTransaction(income);
      account.addTransaction(expense);

      expect(account.balance.getValue()).toBe(500);
    });

    it('should ignore canceled transactions in balance calculation', () => {
      const account = makeAccount(defaultProps);

      const income = makeTransaction({
        accountId: account.id.getValue(),
        amount: 1000,
        type: TransactionType.INCOME,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      const canceledExpense = makeTransaction({
        accountId: account.id.getValue(),
        amount: 500,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CANCELED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: expenseCategory.id.getValue(),
      });

      account.addTransaction(income);
      account.addTransaction(canceledExpense);

      expect(account.balance.getValue()).toBe(1000);
    });

    it('should ignore unpaid transactions in balance calculation', () => {
      const account = makeAccount(defaultProps);

      const income = makeTransaction({
        accountId: account.id.getValue(),
        amount: 1000,
        type: TransactionType.INCOME,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      const unpaidExpense = makeTransaction({
        accountId: account.id.getValue(),
        amount: 1000,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        dueDate: faker.date.past().getTime(),
        paymentDate: undefined, // unpaid date
        categoryId: expenseCategory.id.getValue(),
      });

      account.addTransaction(income);
      account.addTransaction(unpaidExpense);

      expect(account.balance.getValue()).toBe(1000);
    });
  });

  describe('State Management', () => {
    it('should set account as default', () => {
      const account = makeAccount({ ...defaultProps, isDefault: false });
      expect(account.isDefault).toBeFalsy();
      account.setDefault(true);
      expect(account.isDefault).toBeTruthy();
      account.setDefault(false);
      expect(account.isDefault).toBeFalsy();
    });

    it('should set account as active/inactive', () => {
      const account = makeAccount({ ...defaultProps, isActive: true });
      expect(account.isActive).toBeTruthy();
      account.setActive(false);
      expect(account.isActive).toBeFalsy();
      account.setActive(true);
      expect(account.isActive).toBeTruthy();
    });
  });

  describe('Transaction Management', () => {
    it('should add transaction to account', () => {
      const account = makeAccount(defaultProps);
      const transaction = makeTransaction({
        accountId: account.id.getValue(),
        amount: 100,
        type: TransactionType.INCOME,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      account.addTransaction(transaction);
      expect(account.transactions).toHaveLength(1);
      expect(account.transactions[0]).toStrictEqual(transaction);
    });

    it('should add multiple transactions to account', () => {
      const account = makeAccount(defaultProps);
      const transaction1 = makeTransaction({
        accountId: account.id.getValue(),
        amount: 100,
        type: TransactionType.INCOME,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      const transaction2 = makeTransaction({
        accountId: account.id.getValue(),
        amount: 200,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.CONFIRMED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: expenseCategory.id.getValue(),
      });

      account.addTransactions([transaction1, transaction2]);
      expect(account.transactions).toHaveLength(2);
      expect(account.transactions[0]).toStrictEqual(transaction1);
      expect(account.transactions[1]).toStrictEqual(transaction2);
    });

    it('should not add transaction to account if it does not belong to it', () => {
      const account = makeAccount(defaultProps);
      const invalidTransaction = makeTransaction({
        accountId: faker.string.uuid(),
        amount: 100,
        type: TransactionType.INCOME,
        status: TransactionStatus.CANCELED,
        dueDate: now.getTime(),
        paymentDate: now.getTime(),
        categoryId: incomeCategory.id.getValue(),
      });

      expect(() => account.addTransaction(invalidTransaction)).toThrow(
        TransactionDoesNotBelongToAccountError,
      );
    });
  });

  describe('Primitive Conversion', () => {
    it('should convert account to primitive object', () => {
      const account = makeAccount(defaultProps);
      const primitive = account.toPrimitive();

      expect(primitive).toStrictEqual({
        id: account.id.getValue(),
        userId: account.userId.getValue(),
        name: account.name,
        type: defaultProps.type,
        isDefault: defaultProps.isDefault,
        isActive: defaultProps.isActive,
        createdAt: defaultProps.createdAt,
        balance: defaultProps.initialBalance,
      });
    });
  });
});
