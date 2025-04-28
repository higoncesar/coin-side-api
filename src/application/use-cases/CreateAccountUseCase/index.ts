import { ValidatedUseCase } from '../_shared/ValidateUseCase';
import { CreateAccountDTO } from '@/application/dtos/CreateAccountDTO';
import { CreateAccountInputSchema } from '@/application/schemas/CreateAccountInputSchema';
import { AccountPrimitives } from '@/domain/entities/Account';
import { AccountType } from '@/domain/entities/Account/enums/AccountType';
import { AccountAlreadyExistsError } from '@/domain/exceptions/AccountAlreadyExistsError';
import { AccountFactory } from '@/domain/factories/AccountFactory';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class CreateAccountUseCase extends ValidatedUseCase<CreateAccountDTO, AccountPrimitives> {
  protected schema = CreateAccountInputSchema;

  constructor(private accountRepository: IAccountRepository) {
    super();
  }

  protected async executeValidated(props: CreateAccountDTO): Promise<AccountPrimitives> {
    const { name, type, userId, isDefault, initialBalance } = props;

    const isAccountAlreadyExists = await this.accountRepository.findByName(name, userId);

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
