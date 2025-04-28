import { z } from 'zod';
import { AccountType } from '@/domain/Account/enums/AccountType';

export const CreateAccountInputSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.nativeEnum(AccountType),
  userId: z.string().uuid(),
  isDefault: z.boolean(),
  parentCategoryId: z.string().uuid().optional(),
  initialBalance: z.number().refine((val) => Number.isInteger(val * 100), {
    message: 'The value must have at most two decimal places',
  }),
});
