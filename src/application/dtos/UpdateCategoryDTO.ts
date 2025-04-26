export interface UpdateCategoryDTO {
  categoryId: string;
  userId: string;
  name: string;
  parentCategoryId?: string;
}
