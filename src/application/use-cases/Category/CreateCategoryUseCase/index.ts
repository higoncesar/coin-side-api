import { ValidatedUseCase } from '../../_shared/ValidateUseCase';
import {
  CreateCategoryDTO,
  CreateCategoryInputSchema,
} from '@/application/dtos/Category/CreateCategoryDTO';
import { CategoryPrimitives } from '@/domain/Category/entities/Category';
import { CategoryAlreadyExistError } from '@/domain/Category/exceptions/CategoryAlreadyExistError';
import { ParentCategoryDoesNotExistError } from '@/domain/Category/exceptions/ParentCategoryDoesNotExistError';
import { CategoryFactory } from '@/domain/Category/factories/CategoryFactory';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';

export class CreateCategoryUseCase extends ValidatedUseCase<CreateCategoryDTO, CategoryPrimitives> {
  protected schema = CreateCategoryInputSchema;

  constructor(private categoryRepository: ICategoryRepository) {
    super();
  }

  protected async executeValidated(props: CreateCategoryDTO): Promise<CategoryPrimitives> {
    const { name, userId, parentCategoryId, type } = props;

    const isCatetoryAlreadyExists = await this.categoryRepository.findByNameAndUserId(name, userId);

    if (isCatetoryAlreadyExists) {
      throw new CategoryAlreadyExistError();
    }

    const isSubcategory = parentCategoryId !== undefined;
    const isExpenseType = type === 'expense';

    if (isSubcategory) {
      const parentCategory = await this.categoryRepository.findByIdAndUserId(
        parentCategoryId,
        userId,
      );
      if (!parentCategory) {
        throw new ParentCategoryDoesNotExistError();
      }

      if (isExpenseType) {
        const category = CategoryFactory.createExpenseCagetory({
          name,
          userId,
          parentCategory,
        });
        const createdCategory = await this.categoryRepository.create(category);
        return createdCategory.toPrimitive();
      }

      const category = CategoryFactory.createIncomeCagetory({
        name,
        userId,
        parentCategory,
      });
      const createdCategory = await this.categoryRepository.create(category);
      return createdCategory.toPrimitive();
    }

    if (isExpenseType) {
      const category = CategoryFactory.createExpenseCagetory({
        name,
        userId,
      });

      const createdCategory = await this.categoryRepository.create(category);

      return createdCategory.toPrimitive();
    }
    const category = CategoryFactory.createIncomeCagetory({
      name,
      userId,
    });

    const createdCategory = await this.categoryRepository.create(category);
    return createdCategory.toPrimitive();
  }
}
