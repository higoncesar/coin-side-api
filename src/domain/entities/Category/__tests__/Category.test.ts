import { describe, expect, it } from 'vitest';
import { Category } from '..';
import { UniqueEntityId } from '@/domain/_shared/UniqueEntityId';
import { InvalidParentCategoryAssignmentError } from '@/domain/exceptions/InvalidParentCategoryAssignmentError';
import { SubcategoryMatchTypeError } from '@/domain/exceptions/SubcategoryMatchTypeError';
import {
  makeExpenseCategory,
  makeExpenseSubcategory,
  makeIncomeCategory,
  makeIncomeSubcategory,
} from '@/tests/factories/MakeCategory';

describe('Category', () => {
  describe('income category', () => {
    it('should category', () => {
      const props = {
        userId: new UniqueEntityId(),
        name: 'Income category name',
        createdAt: new Date(),
      };

      const category = Category.createIncome(props);

      expect(category.id).toBeDefined();
      expect(category.userId.isEqual(props.userId.getValue())).toBeTruthy();
      expect(category.name).toStrictEqual(props.name);
      expect(category.isIncome()).toBeTruthy();
      expect(category.isExpense()).toBeFalsy();
      expect(category.isSubcategory()).toBeFalsy();
      expect(category.parentCategory).toBeUndefined();
      expect(category.toPrimitive()).toStrictEqual({
        id: category.id.getValue(),
        userId: category.userId.getValue(),
        type: 'INCOME',
        name: category.name,
        createdAt: category.createdAt,
        parentCategoryId: undefined,
      });
    });

    it('should update the name', () => {
      const category = makeIncomeCategory();
      const newName = 'New name';
      expect(category.name).not.toStrictEqual(newName);
      category.setName(newName);
      expect(category.name).toStrictEqual(newName);
    });

    it('should create a subcategory', () => {
      const category = makeIncomeCategory();
      const props = {
        userId: category.userId,
        name: 'Income subcategory name',
        createdAt: new Date(),
        parentCategory: category,
      };
      const subcategory = Category.createIncomeSubcategory(props);
      expect(subcategory.id).toBeDefined();
      expect(subcategory.userId.isEqual(props.userId.getValue())).toBeTruthy();
      expect(subcategory.name).toStrictEqual(props.name);
      expect(subcategory.isIncome()).toBeTruthy();
      expect(subcategory.isExpense()).toBeFalsy();
      expect(subcategory.isSubcategory()).toBeTruthy();
      expect(subcategory.parentCategory).toStrictEqual(category);
      expect(subcategory.toPrimitive()).toStrictEqual({
        id: subcategory.id.getValue(),
        userId: subcategory.userId.getValue(),
        type: 'INCOME',
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        parentCategoryId: subcategory.parentCategory?.id.getValue(),
      });
    });

    it('should update the parent category', () => {
      const parentCategory = makeIncomeCategory();

      const subcategory = makeIncomeSubcategory({
        parentCategory: parentCategory,
      });
      expect(subcategory.parentCategory).toStrictEqual(parentCategory);

      const newParentCategory = makeIncomeCategory();
      subcategory.setParentCategory(newParentCategory);

      expect(subcategory.parentCategory).toStrictEqual(newParentCategory);
      expect(subcategory.parentCategory).not.toStrictEqual(parentCategory);
    });

    it('should throw an error if the parent category is not income', () => {
      const parentCategory = makeIncomeCategory();

      const subcategory = makeIncomeSubcategory({
        parentCategory: parentCategory,
      });
      expect(subcategory.parentCategory).toStrictEqual(parentCategory);

      const newParentCategory = makeExpenseCategory();
      expect(() => subcategory.setParentCategory(newParentCategory)).toThrowError(
        SubcategoryMatchTypeError,
      );
    });

    it('should throw an error if the category is not a subcategory', () => {
      const category = makeIncomeCategory();
      const newParentCategory = makeIncomeCategory();
      expect(() => category.setParentCategory(newParentCategory)).toThrowError(
        InvalidParentCategoryAssignmentError,
      );
    });

    it('should throw an error if the parent category is not income', () => {
      const category = makeExpenseCategory();
      const props = {
        userId: category.userId,
        name: 'Income subcategory name',
        createdAt: new Date(),
        parentCategory: category,
      };

      expect(() => Category.createIncomeSubcategory(props)).toThrowError(SubcategoryMatchTypeError);
    });
  });

  describe('expense category', () => {
    it('should create a category', () => {
      const props = {
        userId: new UniqueEntityId(),
        name: 'Expense category name',
        createdAt: new Date(),
      };

      const category = Category.createExpense(props);

      expect(category.id).toBeDefined();
      expect(category.userId.isEqual(props.userId.getValue())).toBeTruthy();
      expect(category.name).toStrictEqual(props.name);
      expect(category.isIncome()).toBeFalsy();
      expect(category.isExpense()).toBeTruthy();
      expect(category.isSubcategory()).toBeFalsy();
      expect(category.parentCategory).toBeUndefined();
      expect(category.toPrimitive()).toStrictEqual({
        id: category.id.getValue(),
        userId: category.userId.getValue(),
        type: 'EXPENSE',
        name: category.name,
        createdAt: category.createdAt,
        parentCategoryId: undefined,
      });
    });

    it('should update the name', () => {
      const category = makeExpenseCategory();
      const newName = 'New name';
      expect(category.name).not.toStrictEqual(newName);
      category.setName(newName);
      expect(category.name).toStrictEqual(newName);
    });

    it('should create a subcategory', () => {
      const category = makeExpenseCategory();
      const props = {
        userId: category.userId,
        name: 'Expense subcategory name',
        createdAt: new Date(),
        parentCategory: category,
      };
      const subcategory = Category.createExpenseSubcategory(props);
      expect(subcategory.id).toBeDefined();
      expect(subcategory.userId.isEqual(props.userId.getValue())).toBeTruthy();
      expect(subcategory.name).toStrictEqual(props.name);
      expect(subcategory.isIncome()).toBeFalsy();
      expect(subcategory.isExpense()).toBeTruthy();
      expect(subcategory.isSubcategory()).toBeTruthy();
      expect(subcategory.parentCategory).toStrictEqual(category);
      expect(subcategory.toPrimitive()).toStrictEqual({
        id: subcategory.id.getValue(),
        userId: subcategory.userId.getValue(),
        type: 'EXPENSE',
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        parentCategoryId: subcategory.parentCategory?.id.getValue(),
      });
    });

    it('should update the parent category', () => {
      const parentCategory = makeExpenseCategory();

      const subcategory = makeExpenseSubcategory({
        parentCategory: parentCategory,
      });
      expect(subcategory.parentCategory).toStrictEqual(parentCategory);

      const newParentCategory = makeExpenseCategory();
      subcategory.setParentCategory(newParentCategory);

      expect(subcategory.parentCategory).toStrictEqual(newParentCategory);
      expect(subcategory.parentCategory).not.toStrictEqual(parentCategory);
    });

    it('should throw an error if the parent category is not expense', () => {
      const parentCategory = makeExpenseCategory();

      const subcategory = makeExpenseSubcategory({
        parentCategory: parentCategory,
      });
      expect(subcategory.parentCategory).toStrictEqual(parentCategory);

      const newParentCategory = makeIncomeCategory();
      expect(() => subcategory.setParentCategory(newParentCategory)).toThrowError(
        SubcategoryMatchTypeError,
      );
    });

    it('should throw an error if the category is not a subcategory', () => {
      const category = makeExpenseCategory();
      const newParentCategory = makeExpenseCategory();
      expect(() => category.setParentCategory(newParentCategory)).toThrowError(
        InvalidParentCategoryAssignmentError,
      );
    });

    it('should throw an error if the parent category is not expense', () => {
      const category = makeIncomeCategory();
      const props = {
        userId: category.userId,
        name: 'Expense subcategory name',
        createdAt: new Date(),
        parentCategory: category,
      };

      expect(() => Category.createExpenseSubcategory(props)).toThrowError(
        SubcategoryMatchTypeError,
      );
    });
  });
});
