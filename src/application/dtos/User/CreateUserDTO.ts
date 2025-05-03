import { z } from 'zod';

export const CreateUserInputSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/(?=.*[a-z])/, { message: 'The password must contain at least one lowercase letter.' })
    .regex(/(?=.*[A-Z])/, { message: 'The password must contain at least one uppercase letter.' })
    .regex(/(?=.*\d)/, { message: 'The password must contain at least one number.' })
    .regex(/(?=.*[^a-zA-Z\d])/, {
      message: 'The password must contain at least one special character.',
    }),
});

export type CreateUserDTO = z.infer<typeof CreateUserInputSchema>;
