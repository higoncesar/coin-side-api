import { ValidatedUseCase } from '../_shared/ValidateUseCase';
import { CreateCategoryDTO } from '@/application/dtos/CreateCategoryDTO';
import { CreateCategoryInputSchema } from '@/application/schemas/CreateCategoryInputSchema';
import { CategoryPrimitives } from '@/domain/entities/Category';
import { CategoryAlreadyExistError } from '@/domain/exceptions/CategoryAlreadyExistError';
import { ParentCategoryDoesNotExistError } from '@/domain/exceptions/ParentCategoryDoesNotExistError';
import { CategoryFactory } from '@/domain/factories/CategoryFactory';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CreateCategoryUseCase extends ValidatedUseCase<CreateCategoryDTO, CategoryPrimitives> {
  protected schema = CreateCategoryInputSchema;

  constructor(private categoryRepository: ICategoryRepository) {
    super();
  }

  protected async executeValidated(props: CreateCategoryDTO): Promise<CategoryPrimitives> {
    const { name, userId, parentCategoryId, type } = props;

    const isCatetoryAlreadyExists = await this.categoryRepository.findByName(name, userId);

    if (isCatetoryAlreadyExists) {
      throw new CategoryAlreadyExistError();
    }

    const isSubcategory = parentCategoryId !== undefined;
    const isExpenseType = type === 'expense';

    if (isSubcategory) {
      const parentCategory = await this.categoryRepository.findById(parentCategoryId);
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
