import { z } from 'zod';
import { TransactionType } from '@/domain/Account/enums/TransactionType';

export const CreateTransactionInputSchema = z.object({
  accountId: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  amount: z.number().refine((val) => Number.isInteger(val * 100), {
    message: 'The value must have at most two decimal places',
  }),
  description: z.string().min(3),
  dueDate: z.date(),
  paymentDate: z
    .date()
    .refine((date) => !date || date.getTime() <= Date.now(), {
      message: 'Payment date cannot be in the future',
    })
    .optional(),
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionInputSchema>;
