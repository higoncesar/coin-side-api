import { ValidatedUseCase } from '../_shared/ValidateUseCase';
import { CreateUserDTO } from '@/application/dtos/CreateUserDTO';
import { CreateUserInputSchema } from '@/application/schemas/CreateUserInputSchema';
import { PasswordService } from '@/application/services/PasswordService';
import { UserPrimitives } from '@/domain/entities/User';
import { UserAlreadyExistError } from '@/domain/exceptions/UserAlreadyExistError';
import { UserFactory } from '@/domain/factories/UserFactory';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

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
