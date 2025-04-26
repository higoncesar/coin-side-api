import { z } from 'zod';

export const UpdateCategoryInputSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  userId: z.string().uuid(),
  parentCategoryId: z.string().uuid().optional(),
});
