import { faker } from '@faker-js/faker/locale/pt_BR';
import { AccountType } from '@/domain/Account/enums/AccountType';
import {
  CreateAccountFactoryProps,
  AccountFactory,
} from '@/domain/Account/factories/AccountFactory';

export function makeAccount(props: Partial<CreateAccountFactoryProps> = {}, id?: string) {
  const defaultProps: CreateAccountFactoryProps = {
    userId: props.userId ?? faker.string.uuid(),
    name: props.name ?? faker.finance.accountName(),
    type: props.type ?? AccountType.BANK,
    isDefault: props.isDefault ?? false,
    isActive: props.isActive ?? true,
    initialBalance: props.initialBalance ?? faker.number.int({ min: 100, max: 1000 }),
    createdAt: props.createdAt ?? faker.date.past().getTime(),
  };

  return AccountFactory.create(defaultProps, id);
}
