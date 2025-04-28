import { z } from 'zod';

export const CreateCategoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense']),
  userId: z.string().uuid(),
  parentCategoryId: z.string().uuid().optional(),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategoryInputSchema>;
