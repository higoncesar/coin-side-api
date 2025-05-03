import {
  CreateAccountDTO,
  CreateAccountInputSchema,
} from '@/application/dtos/Account/CreateAccountDTO';
import { ValidatedUseCase } from '@/application/use-cases/_shared/ValidateUseCase';
import { AccountPrimitives } from '@/domain/Account/entities/Account';
import { AccountType } from '@/domain/Account/enums/AccountType';
import { AccountAlreadyExistsError } from '@/domain/Account/exceptions/AccountAlreadyExistsError';
import { AccountFactory } from '@/domain/Account/factories/AccountFactory';
import { IAccountRepository } from '@/domain/Account/repositories/IAccountRepository';

export class CreateAccountUseCase extends ValidatedUseCase<CreateAccountDTO, AccountPrimitives> {
  protected schema = CreateAccountInputSchema;

  constructor(private accountRepository: IAccountRepository) {
    super();
  }

  protected async executeValidated(props: CreateAccountDTO): Promise<AccountPrimitives> {
    const { name, type, userId, isDefault, initialBalance } = props;

    const isAccountAlreadyExists = await this.accountRepository.findByNameAndUserId(name, userId);

    if (isAccountAlreadyExists) {
      throw new AccountAlreadyExistsError();
    }

    if (isDefault) {
      const defaultAccount = await this.accountRepository.findDefaultAccount(userId);

      if (defaultAccount?.isDefault) {
        defaultAccount.setDefault(false);
        await this.accountRepository.save(defaultAccount);
      }
    }

    const account = AccountFactory.create({
      name,
      type: AccountType[type as keyof typeof AccountType],
      userId,
      isDefault,
      isActive: true,
      initialBalance,
    });

    const createdAccount = await this.accountRepository.create(account);

    return createdAccount.toPrimitive();
  }
}
