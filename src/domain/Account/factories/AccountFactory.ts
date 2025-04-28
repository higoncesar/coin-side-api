import { UniqueEntityId } from '@/domain/_shared/UniqueEntityId';
import { Account } from '@/domain/Account/entities/Account';
import { AccountType } from '@/domain/Account/enums/AccountType';
import { DomainDate } from '@/domain/value-objects/DomainDate';
import { Money } from '@/domain/value-objects/Money';

export interface CreateAccountFactoryProps {
  userId: string;
  name: string;
  type: keyof typeof AccountType;
  isDefault: boolean;
  isActive: boolean;
  initialBalance: number;
  createdAt?: number;
}

export class AccountFactory {
  static create(props: CreateAccountFactoryProps, id?: string) {
    const accountId = id ? new UniqueEntityId(id) : undefined;
    const userId = new UniqueEntityId(props.userId);
    const initialBalance = Money.create(props.initialBalance);
    const createdAt = props.createdAt
      ? DomainDate.create(new Date(props.createdAt))
      : DomainDate.now();

    return Account.create(
      {
        userId,
        name: props.name,
        type: AccountType[props.type],
        isDefault: props.isDefault,
        isActive: props.isActive,
        initialBalance,
        createdAt,
      },
      accountId,
    );
  }
}
