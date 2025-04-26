import { ValidatedUseCase } from '../_shared/ValidateUseCase';
import { UpdateUserProfileDTO } from '@/application/dtos/UpdateUserProfileDTO';
import { UpdateUserInputSchema } from '@/application/schemas/UpdateUserInputSchema';
import { UserNotFoundError } from '@/domain/exceptions/UserNotFoundError';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-object/Email';

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
