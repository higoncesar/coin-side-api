import { Category } from '@/domain/Category/entities/Category';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';

export class CategoryRepositoryInMemory implements ICategoryRepository {
  categories: Category[] = [];

  async findByIdAndUserId(id: string, userId: string) {
    const category = this.categories.find(
      (category) => category.id.getValue() === id && category.userId.getValue() === userId,
    );
    return category;
  }

  async findByNameAndUserId(name: string, userId: string) {
    const category = this.categories.find(
      (category) => category.name === name && category.userId.getValue() === userId,
    );
    return category;
  }

  async create(category: Category) {
    this.categories.push(category);
    return category;
  }

  async save(category: Category) {
    const index = this.categories.findIndex((c) => c.id.isEqual(category.id.getValue()));
    if (index !== -1) {
      this.categories[index] = category;
    }
  }
}
