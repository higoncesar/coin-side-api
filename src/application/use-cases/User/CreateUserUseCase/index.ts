import { CreateUserDTO, CreateUserInputSchema } from '@/application/dtos/User/CreateUserDTO';
import { PasswordService } from '@/application/services/PasswordService';
import { ValidatedUseCase } from '@/application/use-cases/_shared/ValidateUseCase';
import { UserPrimitives } from '@/domain/User/entities/User';
import { UserAlreadyExistError } from '@/domain/User/exceptions/UserAlreadyExistError';
import { UserFactory } from '@/domain/User/factories/UserFactory';
import { IUserRepository } from '@/domain/User/repositories/IUserRepository';

export class CreateUserUseCase extends ValidatedUseCase<CreateUserDTO, UserPrimitives> {
  protected schema = CreateUserInputSchema;
  constructor(private userRepository: IUserRepository) {
    super();
  }

  async executeValidated(props: CreateUserDTO) {
    const { email, name, password } = props;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistError();
    }

    const passwordHash = await PasswordService.hash(password);

    const user = UserFactory.create({ email, name, passwordHash });

    const createdUser = await this.userRepository.create(user);

    return createdUser.toPrimitive();
  }
}
