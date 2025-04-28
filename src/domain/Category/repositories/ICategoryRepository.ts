import { Category } from '@/domain/Category/entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | undefined>;
  findByName(name: string, userId: string): Promise<Category | undefined>;
  create(category: Category): Promise<Category>;
  save(category: Category): Promise<void>;
}
