import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeAll, describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { CreateCategoryUseCase } from '..';
import { CreateCategoryDTO } from '@/application/dtos/Category/CreateCategoryDTO';
import { CategoryAlreadyExistError } from '@/domain/Category/exceptions/CategoryAlreadyExistError';

import { ParentCategoryDoesNotExistError } from '@/domain/Category/exceptions/ParentCategoryDoesNotExistError';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';
import { CategoryRepositoryInMemory } from '@/infraestructure/database/repositories/memory/CategoryRepositoryInMemory';

describe('CreateCategoryUseCase', () => {
  let createCategoryUseCase: CreateCategoryUseCase;
  let categoryRepository: ICategoryRepository;

  beforeAll(() => {
    categoryRepository = new CategoryRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should throw an error when input is invalid', async () => {
    const categoryProps: CreateCategoryDTO = {
      userId: 'not-a-uuid',
      type: 'UNKNOWN_TYPE',
      name: faker.lorem.words(101),
    };
    await expect(createCategoryUseCase.execute(categoryProps)).rejects.toThrowError(ZodError);
  });

  describe('Income Category', () => {
    it('should be able to create category', async () => {
      const categoryProps: CreateCategoryDTO = {
        userId: faker.string.uuid(),
        type: 'income',
        name: 'Category Name',
      };

      const category = await createCategoryUseCase.execute(categoryProps);

      expect(category).toStrictEqual({
        id: category.id,
        name: categoryProps.name,
        type: 'INCOME',
        userId: categoryProps.userId,
        createdAt: category.createdAt,
        parentCategoryId: undefined,
      });
    });

    it('should throw an error if category name already exists', async () => {
      const categoryProps: CreateCategoryDTO = {
        userId: faker.string.uuid(),
        type: 'income',
        name: faker.lorem.word(),
      };

      await createCategoryUseCase.execute(categoryProps);

      await expect(createCategoryUseCase.execute(categoryProps)).rejects.toThrowError(
        CategoryAlreadyExistError,
      );
    });

    describe('Subcategory', () => {
      it('should be able to create subcategory', async () => {
        const parentCategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'income',
          name: 'Parent Category',
        };

        const parentCategory = await createCategoryUseCase.execute(parentCategoryProps);

        const subcategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'income',
          name: faker.lorem.word(),
          parentCategoryId: parentCategory.id,
        };

        const subcategory = await createCategoryUseCase.execute(subcategoryProps);

        expect(subcategory).toStrictEqual({
          id: subcategory.id,
          name: subcategoryProps.name,
          type: 'INCOME',
          userId: subcategoryProps.userId,
          createdAt: subcategory.createdAt,
          parentCategoryId: parentCategory.id,
        });
      });

      it('should throw an error if parent category dost not exist', async () => {
        const subcategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'expense',
          name: faker.lorem.word(),
          parentCategoryId: faker.string.uuid(),
        };

        await expect(createCategoryUseCase.execute(subcategoryProps)).rejects.toThrowError(
          ParentCategoryDoesNotExistError,
        );
      });
    });
  });

  describe('Expense Category', () => {
    it('should be able to create category', async () => {
      const categoryProps: CreateCategoryDTO = {
        userId: faker.string.uuid(),
        type: 'expense',
        name: faker.lorem.word(),
      };

      const category = await createCategoryUseCase.execute(categoryProps);

      expect(category).toStrictEqual({
        id: category.id,
        name: categoryProps.name,
        type: 'EXPENSE',
        userId: categoryProps.userId,
        createdAt: category.createdAt,
        parentCategoryId: undefined,
      });
    });

    it('should throw an error if category name already exists', async () => {
      const categoryProps: CreateCategoryDTO = {
        userId: faker.string.uuid(),
        type: 'expense',
        name: faker.lorem.word(),
      };

      await createCategoryUseCase.execute(categoryProps);

      await expect(createCategoryUseCase.execute(categoryProps)).rejects.toThrowError(
        CategoryAlreadyExistError,
      );
    });

    describe('Subcategory', () => {
      it('should be able to create subcategory', async () => {
        const parentCategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'expense',
          name: 'Parent Category',
        };

        const parentCategory = await createCategoryUseCase.execute(parentCategoryProps);

        const subcategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'expense',
          name: faker.lorem.word(),
          parentCategoryId: parentCategory.id,
        };

        const subcategory = await createCategoryUseCase.execute(subcategoryProps);

        expect(subcategory).toStrictEqual({
          id: subcategory.id,
          name: subcategoryProps.name,
          type: 'EXPENSE',
          userId: subcategoryProps.userId,
          createdAt: subcategory.createdAt,
          parentCategoryId: parentCategory.id,
        });
      });

      it('should throw an error if parent category dost not exist', async () => {
        const subcategoryProps: CreateCategoryDTO = {
          userId: faker.string.uuid(),
          type: 'income',
          name: faker.lorem.word(),
          parentCategoryId: faker.string.uuid(),
        };

        await expect(createCategoryUseCase.execute(subcategoryProps)).rejects.toThrowError(
          ParentCategoryDoesNotExistError,
        );
      });
    });
  });
});
