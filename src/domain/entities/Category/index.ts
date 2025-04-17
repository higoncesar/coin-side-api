import { UniqueEntityId } from '../_shared/UniqueEntityId';
import { Entity } from '@/domain/entities/_shared/Entity';
import { InvalidParentCategoryAssignmentError } from '@/domain/exceptions/InvalidParentCategoryAssignmentError';
import { SubcategoryMatchTypeError } from '@/domain/exceptions/SubcategoryMatchTypeError';

interface CategoryProps {
  userId: UniqueEntityId;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  createdAt?: Date;
  parentCategory?: Category;
}

type CreateProps = Omit<CategoryProps, 'type' | 'paraentCategory'>;

type CreateSubcategoryProps = CreateProps & { parentCategory: Category };

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static createIncome(props: CreateProps, id?: UniqueEntityId) {
    return new Category({ ...props, type: 'INCOME' }, id);
  }

  static createExpense(props: CreateProps, id?: UniqueEntityId) {
    return new Category({ ...props, type: 'EXPENSE' }, id);
  }

  static createIncomeSubcategory(props: CreateSubcategoryProps, id?: UniqueEntityId) {
    if (!props.parentCategory.isIncome()) {
      throw new SubcategoryMatchTypeError();
    }
    return new Category({ ...props, type: 'INCOME' }, id);
  }

  static createExpenseSubcategory(props: CreateSubcategoryProps, id?: UniqueEntityId) {
    if (!props.parentCategory.isExpense()) {
      throw new SubcategoryMatchTypeError();
    }

    return new Category({ ...props, type: 'EXPENSE' }, id);
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  get parentCategory() {
    return this.props.parentCategory;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  setName(name: string) {
    this.props.name = name;
  }

  setParentCategory(parentCategory: Category) {
    if (!this.isSubcategory()) {
      throw new InvalidParentCategoryAssignmentError();
    }

    if (parentCategory.props.type !== this.props.type) {
      throw new SubcategoryMatchTypeError();
    }

    this.props.parentCategory = parentCategory;
  }

  isIncome() {
    return this.props.type === 'INCOME';
  }

  isExpense() {
    return this.props.type === 'EXPENSE';
  }

  isSubcategory() {
    return !!this.props.parentCategory;
  }

  toPrimitive() {
    return {
      id: this.id.getValue(),
      userId: this.userId.getValue(),
      type: this.props.type,
      name: this.props.name,
      parentCategoryId: this.props.parentCategory?.id.getValue(),
      createdAt: this.props.createdAt,
    };
  }
}
