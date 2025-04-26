import { Category } from '@/domain/entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string, userId: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
}
