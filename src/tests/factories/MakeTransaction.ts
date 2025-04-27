import { faker } from '@faker-js/faker/locale/pt_BR';
import { TransactionStatus } from '@/domain/entities/Account/enums/TransactionStatus';
import { TransactionType } from '@/domain/entities/Account/enums/TransactionType';
import {
  CreateTransactionProps,
  CreateTransferProps,
  TransactionFactory,
} from '@/domain/factories/TransactionFactory';

export function makeTransaction(
  props: Partial<Omit<CreateTransactionProps, 'categoryId'>> &
    Pick<CreateTransactionProps, 'categoryId'> = {},
  id?: string,
) {
  const defaultProps: CreateTransactionProps = {
    userId: props.userId ?? faker.string.uuid(),
    accountId: props.accountId ?? faker.string.uuid(),
    categoryId: props.categoryId,
    paymentDate: props.paymentDate,
    amount: props.amount ?? faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
    dueDate: props.dueDate ?? faker.date.future().getTime(),
    description: props.description ?? faker.lorem.words(2),
    status: props.status ?? TransactionStatus.CONFIRMED,
    type: props.type ?? TransactionType.INCOME,
  };

  return TransactionFactory.createTransaction(defaultProps, id);
}

export function makeTransfer(props: Partial<CreateTransferProps> = {}, id?: string) {
  const defaultProps: CreateTransferProps = {
    userId: props.userId ?? faker.string.uuid(),
    originAccountId: props.originAccountId ?? faker.string.uuid(),
    destinationAccountId: props.destinationAccountId ?? faker.string.uuid(),
    amount: props.amount ?? faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
    dueDate: props.dueDate ?? faker.date.future().getTime(),
    description: props.description ?? faker.lorem.words(2),
    status: props.status ?? TransactionStatus.CONFIRMED,
    paymentDate: props.paymentDate,
  };

  return TransactionFactory.createTransfer(defaultProps, id);
}
