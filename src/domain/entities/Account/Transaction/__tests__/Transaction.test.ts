import { faker } from '@faker-js/faker/locale/pt_BR';
import { describe, it, expect, beforeEach } from 'vitest';
import { TransactionStatus } from '@/domain/entities/Account/enums/TransactionStatus';
import { TransactionType } from '@/domain/entities/Account/enums/TransactionType';
import { Transaction } from '@/domain/entities/Account/Transaction';
import { CategoryIdIsRequiredError } from '@/domain/exceptions/CategoryIdIsRequiredError';
import { TransactionAlreadyCanceledError } from '@/domain/exceptions/TransactionAlreadyCanceledError';
import { TransactionAlreadyPaidError } from '@/domain/exceptions/TransactionAlreadyPaidError';
import { TransactionCanceledCannotBePaidError } from '@/domain/exceptions/TransactionCanceledCannotBePaidError';
import { DomainDate } from '@/domain/value-object/DomainDate';
import { makeTransaction, makeTransfer } from '@/tests/factories/MakeTransaction';

describe('Transaction Entity', () => {
  describe('create', () => {
    it('should create a valid expense transaction', () => {
      const categoryId = faker.string.uuid();
      const transaction = makeTransaction({
        categoryId,
        type: TransactionType.EXPENSE,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.isExpense()).toBeTruthy();
      expect(transaction.categoryId?.getValue()).toBe(categoryId);
      expect(transaction.isConfirmed()).toBeTruthy();
    });

    it('should create a valid income transaction', () => {
      const categoryId = faker.string.uuid();
      const transaction = makeTransaction({
        categoryId,
        type: TransactionType.INCOME,
      });

      expect(transaction).toBeInstanceOf(Transaction);
      expect(transaction.isIncome()).toBeTruthy();
    });

    it('should throw error when creating non-transfer transaction without category', () => {
      expect(() => {
        makeTransaction({
          categoryId: undefined,
          type: TransactionType.EXPENSE,
        });
      }).toThrow(CategoryIdIsRequiredError);
    });
  });

  describe('createTransfer', () => {
    it('should create both origin and destination transactions', () => {
      const { originTransaction, destinationTransaction } = makeTransfer();

      expect(originTransaction).toBeInstanceOf(Transaction);
      expect(destinationTransaction).toBeInstanceOf(Transaction);
      expect(originTransaction.isExpense()).toBeTruthy();
      expect(destinationTransaction.isIncome()).toBeTruthy();
      expect(originTransaction.amount.getValue()).toBe(destinationTransaction.amount.getValue());
      expect(originTransaction.linkedTransferId).toBeDefined();
      expect(originTransaction.linkedTransferId).toStrictEqual(
        destinationTransaction.linkedTransferId,
      );
    });

    it('should use provided transferId if given', () => {
      const transferId = faker.string.uuid();
      const { originTransaction, destinationTransaction } = makeTransfer({}, transferId);

      expect(originTransaction.linkedTransferId?.getValue()).toBe(transferId);
      expect(destinationTransaction.linkedTransferId?.getValue()).toBe(transferId);
    });
  });

  describe('status management', () => {
    let transaction: Transaction;

    beforeEach(() => {
      transaction = makeTransaction({
        categoryId: faker.string.uuid(),
        type: TransactionType.EXPENSE,
      });
    });

    it('should mark transaction as canceled', () => {
      transaction.markAsCanceled();
      expect(transaction.isCanceled()).toBeTruthy();
    });

    it('should throw error when marking already canceled transaction as canceled', () => {
      transaction.markAsCanceled();
      expect(() => transaction.markAsCanceled()).toThrow(TransactionAlreadyCanceledError);
    });

    it('should mark transaction as paid', () => {
      expect(transaction.isPaid()).toBeFalsy();
      expect(transaction.paymentDate).toBeUndefined();
      transaction.markAsPaid();
      expect(transaction.isPaid()).toBeTruthy();
      expect(transaction.paymentDate).toBeDefined();
    });

    it('should throw error when marking already paid transaction as paid', () => {
      transaction.markAsPaid();
      expect(() => transaction.markAsPaid()).toThrow(TransactionAlreadyPaidError);
    });

    it('should throw error when marking canceled transaction as paid', () => {
      transaction.markAsCanceled();
      expect(() => transaction.markAsPaid()).toThrow(TransactionCanceledCannotBePaidError);
    });

    it('should throw error when payment date is in the future', () => {
      const futureDate = DomainDate.create(new Date(transaction.dueDate.getTime() + 86400000));
      expect(() => transaction.markAsPaid(futureDate)).toThrowError();
    });
  });

  describe('overdue status', () => {
    it('should not be overdue if paid', () => {
      const transaction = makeTransaction({
        categoryId: faker.string.uuid(),
        type: TransactionType.EXPENSE,
      });
      transaction.markAsPaid();
      expect(transaction.isOverdue()).toBeFalsy();
    });

    it('should not be overdue if canceled', () => {
      const transaction = makeTransaction({
        categoryId: faker.string.uuid(),
        type: TransactionType.EXPENSE,
      });
      transaction.markAsCanceled();
      expect(transaction.isOverdue()).toBeFalsy();
    });

    it('should be overdue if due date has passed', () => {
      const transaction = makeTransaction({
        categoryId: faker.string.uuid(),
        type: TransactionType.EXPENSE,
        dueDate: new Date(Date.now() - 86400000).getTime(), // yesterday
      });
      expect(transaction.isOverdue()).toBeTruthy();
    });

    it('should not be overdue if due date is in the future', () => {
      const transaction = makeTransaction({
        categoryId: faker.string.uuid(),
        type: TransactionType.EXPENSE,
        dueDate: new Date(Date.now() + 86400000).getTime(), // tomorrow
      });
      expect(transaction.isOverdue()).toBeFalsy();
    });
  });

  describe('toPrimitive', () => {
    it('should convert transaction to primitive values', () => {
      const categoryId = faker.string.uuid();
      const transaction = makeTransaction({
        categoryId,
        type: TransactionType.EXPENSE,
      });

      const primitive = transaction.toPrimitive();

      expect(primitive).toEqual({
        id: transaction.id.getValue(),
        userId: transaction.userId.getValue(),
        accountId: transaction.accountId.getValue(),
        type: TransactionType.EXPENSE,
        amount: transaction.amount.getValue(),
        description: transaction.description,
        paymentDate: undefined,
        dueDate: transaction.dueDate.getTime(),
        createdAt: expect.any(Number),
        status: TransactionStatus.CONFIRMED,
        categoryId: categoryId,
        linkedTransferId: undefined,
      });
    });
  });
});
