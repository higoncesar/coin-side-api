import { Category } from '@/domain/Category/entities/Category';

export interface ICategoryRepository {
  findByIdAndUserId(id: string, userId: string): Promise<Category | undefined>;
  findByNameAndUserId(name: string, userId: string): Promise<Category | undefined>;
  create(category: Category): Promise<Category>;
  save(category: Category): Promise<void>;
}
