import {
  CreateTransactionDTO,
  CreateTransactionInputSchema,
} from '@/application/dtos/Account/Transaction/CreateTransactionDTO';
import { ValidatedUseCase } from '@/application/use-cases/_shared/ValidateUseCase';
import { TransactionPrimitives } from '@/domain/Account/entities/Transaction';
import { TransactionStatus } from '@/domain/Account/enums/TransactionStatus';
import { AccountNotFoundError } from '@/domain/Account/exceptions/AccountNotFoundError';
import { TransactionFactory } from '@/domain/Account/factories/TransactionFactory';
import { IAccountRepository } from '@/domain/Account/repositories/IAccountRepository';
import { ITransactionRepository } from '@/domain/Account/repositories/ITransactionRepository';
import { CategoryNotFoundError } from '@/domain/Category/exceptions/CategoryNotFoundError';
import { InvalidCategoryTypeError } from '@/domain/Category/exceptions/InvalidCategoryTypeError';
import { ICategoryRepository } from '@/domain/Category/repositories/ICategoryRepository';

export class CreateTransactionUseCase extends ValidatedUseCase<
  CreateTransactionDTO,
  TransactionPrimitives
> {
  protected schema = CreateTransactionInputSchema;

  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super();
  }

  protected async executeValidated(props: CreateTransactionDTO): Promise<TransactionPrimitives> {
    const { accountId, userId, type, amount, description, dueDate, categoryId, paymentDate } =
      props;

    const account = await this.accountRepository.findByIdAndUserId(accountId, userId);

    if (!account) {
      throw new AccountNotFoundError();
    }

    const category = await this.categoryRepository.findByIdAndUserId(categoryId, userId);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    if (!category.isSameType(type)) {
      throw new InvalidCategoryTypeError();
    }

    const transaction = TransactionFactory.createTransaction({
      accountId,
      userId,
      type,
      amount,
      description,
      dueDate: dueDate.getTime(),
      paymentDate: paymentDate?.getTime(),
      categoryId,
      status: TransactionStatus.CONFIRMED,
    });

    await this.transactionRepository.create(transaction);

    return transaction.toPrimitive();
  }
}
