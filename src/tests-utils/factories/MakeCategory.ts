import { faker } from '@faker-js/faker/locale/pt_BR';
import {
  CategoryFactory,
  CreateIncomeCagetoryProps,
  CreateExpenseCagetoryProps,
} from '@/domain/Category/factories/CategoryFactory';

export function makeIncomeCategory(props: Partial<CreateIncomeCagetoryProps> = {}, id?: string) {
  const defaultProps: CreateIncomeCagetoryProps = {
    userId: props.userId ?? faker.string.uuid(),
    name: props.name ?? faker.lorem.words(2),
    createdAt: props.createdAt ?? faker.date.past(),
  };

  return CategoryFactory.createIncomeCagetory(defaultProps, id);
}

export function makeIncomeSubcategory(props: Partial<CreateIncomeCagetoryProps> = {}, id?: string) {
  const defaultProps: CreateIncomeCagetoryProps = {
    userId: props.userId ?? faker.string.uuid(),
    name: props.name ?? faker.lorem.words(2),
    createdAt: props.createdAt ?? faker.date.past(),
    parentCategory: props.parentCategory ?? makeIncomeCategory(),
  };

  return CategoryFactory.createIncomeCagetory(defaultProps, id);
}

export function makeExpenseCategory(props: Partial<CreateExpenseCagetoryProps> = {}, id?: string) {
  const defaultProps: CreateExpenseCagetoryProps = {
    userId: props.userId ?? faker.string.uuid(),
    name: props.name ?? faker.lorem.words(2),
    createdAt: props.createdAt ?? faker.date.past(),
  };

  return CategoryFactory.createExpenseCagetory(defaultProps, id);
}

export function makeExpenseSubcategory(
  props: Partial<CreateExpenseCagetoryProps> = {},
  id?: string,
) {
  const defaultProps: CreateExpenseCagetoryProps = {
    userId: props.userId ?? faker.string.uuid(),
    name: props.name ?? faker.lorem.words(2),
    createdAt: props.createdAt ?? faker.date.past(),
    parentCategory: props.parentCategory ?? makeExpenseCategory(),
  };

  return CategoryFactory.createExpenseCagetory(defaultProps, id);
}
