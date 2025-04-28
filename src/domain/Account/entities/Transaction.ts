import { Entity } from '@/domain/_shared/Entity';
import { UniqueEntityId } from '@/domain/_shared/UniqueEntityId';
import { TransactionStatus } from '@/domain/Account/enums/TransactionStatus';

import { TransactionType } from '@/domain/Account/enums/TransactionType';
import { TransactionAlreadyCanceledError } from '@/domain/Account/exceptions/TransactionAlreadyCanceledError';
import { TransactionAlreadyPaidError } from '@/domain/Account/exceptions/TransactionAlreadyPaidError';
import { TransactionCanceledCannotBePaidError } from '@/domain/Account/exceptions/TransactionCanceledCannotBePaidError';
import { TransactionPaymentDateCannotBeInFutureError } from '@/domain/Account/exceptions/TransactionPaymentDateCannotBeInFutureError';
import { CategoryIdIsRequiredError } from '@/domain/Category/exceptions/CategoryIdIsRequiredError';
import { DomainDate } from '@/domain/value-objects/DomainDate';
import { Money } from '@/domain/value-objects/Money';

interface TransactionProps {
  type: TransactionType;
  amount: Money;
  paymentDate?: DomainDate;
  dueDate: DomainDate;
  createdAt: DomainDate;
  status: TransactionStatus;
  description: string;
  userId: UniqueEntityId;
  accountId: UniqueEntityId;
  categoryId?: UniqueEntityId;
  linkedTransferId?: UniqueEntityId;
}

interface CreateTransactionProps extends Omit<TransactionProps, 'createdAt' | 'linkedTransferId'> {}

interface CreateTransferProps {
  amount: Money;
  description: string;
  userId: UniqueEntityId;
  originAccountId: UniqueEntityId;
  destinationAccountId: UniqueEntityId;
  status: TransactionStatus;
  dueDate: DomainDate;
  paymentDate?: DomainDate;
}

interface TransferResult {
  originTransaction: Transaction;
  destinationTransaction: Transaction;
}

export class Transaction extends Entity<TransactionProps> {
  private constructor(props: TransactionProps, id?: UniqueEntityId) {
    super(props, id);
    this.validateCategoryRequirement();
  }

  static create(props: CreateTransactionProps, id?: UniqueEntityId): Transaction {
    const now = DomainDate.now();

    return new Transaction(
      {
        ...props,
        createdAt: now,
      },
      id,
    );
  }

  static createTransfer(props: CreateTransferProps, id?: UniqueEntityId): TransferResult {
    const now = DomainDate.now();
    const transferId = id || new UniqueEntityId();

    const originTransaction = new Transaction(
      {
        ...props,
        type: TransactionType.EXPENSE,
        accountId: props.originAccountId,
        categoryId: undefined,
        createdAt: now,
        linkedTransferId: transferId,
      },
      undefined,
    );

    const destinationTransaction = new Transaction(
      {
        ...props,
        type: TransactionType.INCOME,
        accountId: props.destinationAccountId,
        categoryId: undefined,
        createdAt: now,
        linkedTransferId: transferId,
      },
      undefined,
    );

    return { originTransaction, destinationTransaction };
  }

  private validateCategoryRequirement(): void {
    if (!this.isTransfer() && !this.props.categoryId) {
      throw new CategoryIdIsRequiredError();
    }
  }

  isIncome() {
    return this.props.type === TransactionType.INCOME;
  }

  isExpense() {
    return this.props.type === TransactionType.EXPENSE;
  }

  isConfirmed() {
    return this.props.status === TransactionStatus.CONFIRMED;
  }

  isCanceled() {
    return this.props.status === TransactionStatus.CANCELED;
  }

  isPaid() {
    return !!this.props.paymentDate;
  }

  markAsCanceled() {
    if (this.isCanceled()) {
      throw new TransactionAlreadyCanceledError();
    }
    this.props.status = TransactionStatus.CANCELED;
  }

  markAsPaid(paymentDate: DomainDate = DomainDate.now()) {
    if (this.isPaid()) {
      throw new TransactionAlreadyPaidError();
    }
    if (this.isCanceled()) {
      throw new TransactionCanceledCannotBePaidError();
    }

    if (paymentDate.isAfter(DomainDate.now())) {
      throw new TransactionPaymentDateCannotBeInFutureError();
    }

    this.props.paymentDate = paymentDate;
  }

  isOverdue() {
    if (this.isCanceled() || this.isPaid()) {
      return false;
    }

    return DomainDate.now().isAfter(this.props.dueDate);
  }

  isTransfer() {
    return !!this.props.linkedTransferId;
  }

  get amount() {
    return this.props.amount;
  }

  get description() {
    return this.props.description;
  }

  get userId() {
    return this.props.userId;
  }

  get accountId() {
    return this.props.accountId;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get paymentDate() {
    return this.props.paymentDate;
  }

  get dueDate() {
    return this.props.dueDate;
  }

  get linkedTransferId() {
    return this.props.linkedTransferId;
  }

  toPrimitive() {
    return {
      id: this.id.getValue(),
      userId: this.props.userId.getValue(),
      accountId: this.props.accountId.getValue(),
      type: this.props.type,
      amount: this.props.amount.getValue(),
      description: this.props.description,
      paymentDate: this.props?.paymentDate?.getTime(),
      dueDate: this.props.dueDate.getTime(),
      createdAt: this.props.createdAt.getTime(),
      status: this.props.status,
      categoryId: this.props?.categoryId?.getValue(),
      linkedTransferId: this.props?.linkedTransferId?.getValue(),
    };
  }
}
