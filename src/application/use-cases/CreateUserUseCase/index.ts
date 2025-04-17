import { CreateUserDTO } from '@/application/dtos/CreateUserDTO';
import { PasswordService } from '@/application/services/PasswordService';
import { UserAlreadyExistError } from '@/domain/exceptions/UserAlreadyExistError';
import { UserFactory } from '@/domain/factories/UserFactory';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(props: CreateUserDTO) {
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
