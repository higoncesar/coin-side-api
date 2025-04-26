import { z } from 'zod';
import { CreateUserInputSchema } from './CreateUserInputSchema';

export const UpdateUserInputSchema = CreateUserInputSchema.extend({
  userId: z.string().uuid(),
}).omit({ password: true });
