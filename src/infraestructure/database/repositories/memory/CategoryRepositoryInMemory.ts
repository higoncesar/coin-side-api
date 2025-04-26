import { Category } from '@/domain/entities/Category';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class CategoryRepositoryInMemory implements ICategoryRepository {
  categories: Category[] = [];

  findById(id: string) {
    const category = this.categories.find((category) => category.id.isEqual(id));
    return Promise.resolve(category || null);
  }

  findByName(name: string, userId: string) {
    const category = this.categories.find(
      (category) => category.name === name && category.userId.isEqual(userId),
    );
    return Promise.resolve(category || null);
  }

  create(category: Category) {
    this.categories.push(category);
    return Promise.resolve(category);
  }
}
