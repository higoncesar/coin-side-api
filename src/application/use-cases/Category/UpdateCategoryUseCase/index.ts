import { ValidatedUseCase } from '../../_shared/ValidateUseCase';
import { UpdateCategoryDTO } from '@/application/dtos/Category/UpdateCategoryDTO';
import { UpdateCategoryInputSchema } from '@/application/schemas/Category/UpdateCategoryInputSchema';
import { CategoryAlreadyExistError } from '@/domain/Category/exceptions/CategoryAlreadyExistError';
import { CategoryNotFoundError } from '@/domain/Category/exceptions/CategoryNotFoundError';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';

export class UpdateCategoryUseCase extends ValidatedUseCase<UpdateCategoryDTO, void> {
  protected schema = UpdateCategoryInputSchema;

  constructor(private categoryRepository: ICategoryRepository) {
    super();
  }

  async executeValidated(props: UpdateCategoryDTO): Promise<void> {
    const { categoryId, name, userId, parentCategoryId } = props;
    const category = await this.categoryRepository.findById(categoryId);

    if (!category || !category.userId.isEqual(userId)) {
      throw new CategoryNotFoundError();
    }

    const categoryWithSameName = await this.categoryRepository.findByName(name, userId);
    if (categoryWithSameName && !categoryWithSameName.id.isEqual(categoryId)) {
      throw new CategoryAlreadyExistError();
    }

    if (parentCategoryId) {
      const newParentCategory = await this.categoryRepository.findById(parentCategoryId);
      if (!newParentCategory || !newParentCategory.userId.isEqual(userId)) {
        throw new CategoryNotFoundError();
      }
      category.setParentCategory(newParentCategory);
    }

    category.setName(name);
    await this.categoryRepository.save(category);
  }
}
