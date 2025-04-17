import { UpdateUserProfileDTO } from '@/application/dtos/UpdateUserProfileDTO';
import { UserNotFoundError } from '@/domain/exceptions/UserNotFoundError';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-object/Email';

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(props: UpdateUserProfileDTO) {
    const user = await this.userRepository.findById(props.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.setName(props.name);
    user.setEmail(Email.create(props.email));

    await this.userRepository.save(user);
  }
}
