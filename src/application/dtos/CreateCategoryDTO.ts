export interface CreateCategoryDTO {
  name: string;
  type: string;
  userId: string;
  parentCategoryId?: string;
}
