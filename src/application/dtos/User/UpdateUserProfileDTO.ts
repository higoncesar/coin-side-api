import { z } from 'zod';

export const UpdateUserInputSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(3).max(100),
  email: z.string().email(),
});

export type UpdateUserProfileDTO = z.infer<typeof UpdateUserInputSchema>;
