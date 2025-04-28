import { UpdateUserProfileDTO } from '@/application/dtos/User/UpdateUserProfileDTO';
import { UpdateUserInputSchema } from '@/application/schemas/User/UpdateUserInputSchema';
import { ValidatedUseCase } from '@/application/use-cases/_shared/ValidateUseCase';
import { UserNotFoundError } from '@/domain/User/exceptions/UserNotFoundError';
import { IUserRepository } from '@/domain/User/repositories/IUserRepository';
import { Email } from '@/domain/value-objects/Email';

export class UpdateUserProfileUseCase extends ValidatedUseCase<UpdateUserProfileDTO, void> {
  protected schema = UpdateUserInputSchema;

  constructor(private userRepository: IUserRepository) {
    super();
  }

  async executeValidated(props: UpdateUserProfileDTO): Promise<void> {
    const user = await this.userRepository.findById(props.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    user.setName(props.name);
    user.setEmail(Email.create(props.email));

    await this.userRepository.save(user);
  }
}
