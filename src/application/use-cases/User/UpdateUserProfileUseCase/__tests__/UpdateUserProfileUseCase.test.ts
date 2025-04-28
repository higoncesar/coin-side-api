import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeEach, describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { UpdateUserProfileUseCase } from '..';
import { UserNotFoundError } from '@/domain/User/exceptions/UserNotFoundError';
import { IUserRepository } from '@/domain/User/repositories/IUserRepository';

import { UserRepositoryInMemory } from '@/infraestructure/database/repositories/memory/UserRepositoryInMemory';
import { makeUser } from '@/tests-utils/factories/MakeUser';

describe('UpdateUserProfileUseCase', () => {
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
  });

  it('should throw an error when input is invalid', async () => {
    const invalidUserId = 'not-a-uuid';
    const invalidEmail = 'invalid-email';
    const invalidName = '';

    await expect(
      updateUserProfileUseCase.execute({
        userId: invalidUserId,
        name: invalidName,
        email: invalidEmail,
      }),
    ).rejects.toThrowError(ZodError);
  });

  it('should update user profile', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const newName = faker.person.fullName();
    const newEmail = faker.internet.email();

    await updateUserProfileUseCase.execute({
      userId: user.id.getValue(),
      name: newName,
      email: newEmail,
    });

    const updatedUser = await userRepository.findById(user.id.getValue());
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.name).toBe(newName);
    expect(updatedUser?.email.getValue()).toBe(newEmail);
  });

  it('should throw a error if user not found', async () => {
    const user = makeUser();
    await expect(() =>
      updateUserProfileUseCase.execute({
        userId: user.id.getValue(),
        name: user.name,
        email: user.email.getValue(),
      }),
    ).rejects.toThrowError(UserNotFoundError);
  });
});
