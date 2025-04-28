import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateCategoryUseCase } from '..';
import { CategoryAlreadyExistError } from '@/domain/Category/exceptions/CategoryAlreadyExistError';
import { CategoryNotFoundError } from '@/domain/Category/exceptions/CategoryNotFoundError';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';
import { CategoryRepositoryInMemory } from '@/infraestructure/database/repositories/memory/CategoryRepositoryInMemory';
import { makeIncomeCategory, makeIncomeSubcategory } from '@/tests/factories/MakeCategory';

describe('UpdateCategoryUseCase', () => {
  let categoryRepository: ICategoryRepository;
  let updateCategoryUseCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoryRepository = new CategoryRepositoryInMemory();
    updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  });

  describe('when parent category is not provided', () => {
    it('should be able to update a category', async () => {
      const category = makeIncomeCategory();
      await categoryRepository.create(category);

      const newName = 'Updated Category Name';
      await updateCategoryUseCase.execute({
        categoryId: category.id.getValue(),
        name: newName,
        userId: category.userId.getValue(),
        parentCategoryId: undefined,
      });

      const updatedCategory = await categoryRepository.findById(category.id.getValue());
      expect(updatedCategory?.name).toStrictEqual(newName);
    });

    it('should throw an error if the category does not exist', async () => {
      await expect(() =>
        updateCategoryUseCase.execute({
          categoryId: faker.string.uuid(),
          name: 'Updated Category Name',
          userId: faker.string.uuid(),
          parentCategoryId: undefined,
        }),
      ).rejects.toThrowError(CategoryNotFoundError);
    });

    it('should throw an error if the user does not own the category', async () => {
      const category = makeIncomeCategory();
      await categoryRepository.create(category);

      await expect(() =>
        updateCategoryUseCase.execute({
          categoryId: category.id.getValue(),
          name: 'Updated Category Name',
          userId: faker.string.uuid(),
          parentCategoryId: undefined,
        }),
      ).rejects.toThrowError(CategoryNotFoundError);
    });

    it('should throw an error if the name is already in use', async () => {
      const category = makeIncomeCategory();
      await categoryRepository.create(category);
      const category2 = makeIncomeCategory({ userId: category.userId.getValue() });
      await categoryRepository.create(category2);
      const newName = category.name;

      await expect(() =>
        updateCategoryUseCase.execute({
          categoryId: category2.id.getValue(),
          name: newName,
          userId: category2.userId.getValue(),
          parentCategoryId: category2.parentCategory?.id.getValue(),
        }),
      ).rejects.toThrowError(CategoryAlreadyExistError);
    });
  });

  describe('when the parent category is provided', () => {
    it('should be able to update the category with a new parent category', async () => {
      const parentCategory = makeIncomeCategory();
      await categoryRepository.create(parentCategory);

      const category = makeIncomeSubcategory({
        parentCategory: parentCategory,
        userId: parentCategory.userId.getValue(),
      });
      await categoryRepository.create(category);

      const newParentCategory = makeIncomeCategory({ userId: parentCategory.userId.getValue() });
      await categoryRepository.create(newParentCategory);

      const newName = 'Updated Category Name';
      await updateCategoryUseCase.execute({
        categoryId: category.id.getValue(),
        name: newName,
        userId: category.userId.getValue(),
        parentCategoryId: newParentCategory.id.getValue(),
      });

      const updatedCategory = await categoryRepository.findById(category.id.getValue());
      expect(updatedCategory?.parentCategory?.id.getValue()).toStrictEqual(
        newParentCategory.id.getValue(),
      );
      expect(updatedCategory?.name).toStrictEqual(newName);
    });

    it('should throw an error if the new parent category does not exist', async () => {
      const category = makeIncomeSubcategory();
      await categoryRepository.create(category);

      await expect(() =>
        updateCategoryUseCase.execute({
          categoryId: category.id.getValue(),
          name: 'Updated Category Name',
          userId: category.userId.getValue(),
          parentCategoryId: faker.string.uuid(),
        }),
      ).rejects.toThrowError(CategoryNotFoundError);
    });

    it('should throw an error if the new parent category does not belong to the user', async () => {
      const category = makeIncomeSubcategory();
      await categoryRepository.create(category);

      const newParentCategory = makeIncomeCategory();
      await categoryRepository.create(newParentCategory);

      await expect(() =>
        updateCategoryUseCase.execute({
          categoryId: category.id.getValue(),
          name: 'Updated Category Name',
          userId: category.userId.getValue(),
          parentCategoryId: newParentCategory.id.getValue(),
        }),
      ).rejects.toThrowError(CategoryNotFoundError);
    });
  });
});
