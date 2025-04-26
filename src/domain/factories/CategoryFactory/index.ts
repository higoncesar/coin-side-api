import { UniqueEntityId } from '@/domain/entities/_shared/UniqueEntityId';
import { Category } from '@/domain/entities/Category';

export interface CreateIncomeCagetoryProps {
  userId: string;
  name: string;
  createdAt?: Date;
  parentCategory?: Category;
}

export interface CreateExpenseCagetoryProps {
  userId: string;
  name: string;
  createdAt?: Date;
  parentCategory?: Category;
}

export class CategoryFactory {
  static createIncomeCagetory(props: CreateIncomeCagetoryProps, id?: string) {
    const userId = new UniqueEntityId(props.userId);
    const name = props.name;
    const createdAt = props.createdAt || new Date();
    const parentCategory = props?.parentCategory;

    if (parentCategory) {
      return Category.createIncomeSubcategory(
        { userId, name, createdAt, parentCategory },
        new UniqueEntityId(id),
      );
    }

    return Category.createIncome({ userId, name, createdAt }, new UniqueEntityId(id));
  }

  static createExpenseCagetory(props: CreateExpenseCagetoryProps, id?: string) {
    const userId = new UniqueEntityId(props.userId);
    const name = props.name;
    const createdAt = props.createdAt || new Date();
    const parentCategory = props?.parentCategory;

    if (parentCategory) {
      return Category.createExpenseSubcategory(
        { userId, name, createdAt, parentCategory },
        new UniqueEntityId(id),
      );
    }

    return Category.createExpense({ userId, name, createdAt }, new UniqueEntityId(id));
  }
}
