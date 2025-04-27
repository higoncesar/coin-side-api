import { UniqueEntityId } from '@/domain/_shared/UniqueEntityId';
import { TransactionStatus } from '@/domain/entities/Account/enums/TransactionStatus';
import { TransactionType } from '@/domain/entities/Account/enums/TransactionType';
import { Transaction } from '@/domain/entities/Account/Transaction';
import { DomainDate } from '@/domain/value-object/DomainDate';
import { Money } from '@/domain/value-object/Money';

export interface CreateTransactionProps {
  userId: string;
  accountId: string;
  amount: number;
  dueDate: number;
  paymentDate?: number;
  description: string;
  categoryId?: string;
  status: TransactionStatus;
  type: TransactionType;
}

export interface CreateTransferProps {
  userId: string;
  originAccountId: string;
  destinationAccountId: string;
  amount: number;
  dueDate: number;
  paymentDate?: number;
  description: string;
  status: TransactionStatus;
}

export class TransactionFactory {
  static createTransaction(props: CreateTransactionProps, id?: string) {
    const categoryId = props.categoryId ? new UniqueEntityId(props.categoryId) : undefined;
    const paymentDate = props.paymentDate
      ? DomainDate.create(new Date(props.paymentDate))
      : undefined;
    const dueDate = DomainDate.create(new Date(props.dueDate));
    const amount = Money.create(props.amount);

    return Transaction.create(
      {
        amount,
        description: props.description,
        dueDate,
        paymentDate,
        type: props.type,
        status: props.status,
        userId: new UniqueEntityId(props.userId),
        accountId: new UniqueEntityId(props.accountId),
        categoryId,
      },
      id ? new UniqueEntityId(id) : undefined,
    );
  }

  static createTransfer(props: CreateTransferProps, id?: string) {
    const paymentDate = props.paymentDate
      ? DomainDate.create(new Date(props.paymentDate))
      : undefined;
    const dueDate = DomainDate.create(new Date(props.dueDate));
    const amount = Money.create(props.amount);

    return Transaction.createTransfer(
      {
        amount,
        description: props.description,
        userId: new UniqueEntityId(props.userId),
        originAccountId: new UniqueEntityId(props.originAccountId),
        destinationAccountId: new UniqueEntityId(props.destinationAccountId),
        status: props.status,
        dueDate,
        paymentDate,
      },
      id ? new UniqueEntityId(id) : undefined,
    );
  }
}
