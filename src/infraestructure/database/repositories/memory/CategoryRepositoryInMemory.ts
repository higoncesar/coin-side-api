import { Category } from '@/domain/entities/Category';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CategoryRepositoryInMemory implements ICategoryRepository {
  categories: Category[] = [];

  async findById(id: string) {
    const category = this.categories.find((category) => category.id.getValue() === id);
    return category;
  }

  async findByName(name: string, userId: string) {
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
