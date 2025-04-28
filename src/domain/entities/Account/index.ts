import { TransactionDoesNotBelongToAccountError } from '../../exceptions/TransactionDoesNotBelongToAccountError';
import { AccountType } from './enums/AccountType';
import { Transaction } from './Transaction';
import { AggregateRoot } from '@/domain/_shared/AggregateRoot';
import { UniqueEntityId } from '@/domain/_shared/UniqueEntityId';
import { DomainDate } from '@/domain/value-object/DomainDate';
import { Money } from '@/domain/value-object/Money';

interface AccountProps {
  userId: UniqueEntityId;
  name: string;
  transactions: Transaction[];
  type: AccountType;
  isDefault: boolean;
  isActive: boolean;
  initialBalance: Money;
  createdAt: DomainDate;
}

export interface AccountPrimitives {
  id: string;
  userId: string;
  name: string;
  type: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: number;
  balance: number;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityId) {
    super(props, id);
  }

  private validateTransation(transaction: Transaction) {
    if (!transaction.accountId.isEqual(this.id.getValue())) {
      throw new TransactionDoesNotBelongToAccountError();
    }
  }

  static create(props: Omit<AccountProps, 'transactions'>, id?: UniqueEntityId) {
    return new Account(
      {
        ...props,
        transactions: [],
      },
      id,
    );
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get transactions(): Transaction[] {
    return this.props.transactions;
  }

  get balance() {
    return this.props.transactions.reduce((acc, transaction) => {
      if (transaction.isIncome() && transaction.isConfirmed() && transaction.isPaid())
        return acc.add(transaction.amount);
      if (transaction.isExpense() && transaction.isConfirmed() && transaction.isPaid())
        return acc.subtract(transaction.amount);
      return acc;
    }, Money.create(this.props.initialBalance.getValue()));
  }

  get isDefault() {
    return this.props.isDefault;
  }

  get isActive() {
    return this.props.isActive;
  }

  get type() {
    return this.props.type;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get initialBalance() {
    return this.props.initialBalance;
  }

  setDefault(isDefault: boolean) {
    this.props.isDefault = isDefault;
  }

  setActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  addTransactions(transactions: Transaction[]) {
    transactions.forEach((transaction) => {
      this.validateTransation(transaction);
    });
    this.props.transactions.push(...transactions);
  }

  addTransaction(transaction: Transaction) {
    this.validateTransation(transaction);
    this.props.transactions.push(transaction);
  }

  toPrimitive(): AccountPrimitives {
    return {
      id: this.id.getValue(),
      userId: this.props.userId.getValue(),
      name: this.props.name,
      type: this.props.type,
      isDefault: this.props.isDefault,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt.getTime(),
      balance: this.balance.getValue(),
    };
  }
}
