import { faker } from '@faker-js/faker/locale/pt_BR';
import { beforeEach, describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { CreateUserUseCase } from '..';
import { CreateUserDTO } from '@/application/dtos/CreateUserDTO';
import { UserAlreadyExistError } from '@/domain/exceptions/UserAlreadyExistError';
import { UserRepositoryInMemory } from '@/infraestructure/database/repositories/memory/UserRepositoryInMemory';
import { generateValidPassword } from '@/tests/utils/generatePassword';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: UserRepositoryInMemory;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should throw an error when input is invalid', async () => {
    const userProps: CreateUserDTO = {
      email: 'not-a-valid-email',
      name: '',
      password: '123',
    };

    await expect(createUserUseCase.execute(userProps)).rejects.toThrowError(ZodError);
  });

  it('should be able to create a user', async () => {
    const userProps: CreateUserDTO = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: generateValidPassword(),
    };

    const user = await createUserUseCase.execute(userProps);
    expect(user.name).toStrictEqual(userProps.name);
    expect(user.email).toStrictEqual(userProps.email);
    expect(user.passwordHash).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.id).toBeDefined();
  });

  it('should not be able to create a user with an existing email', async () => {
    const userProps: CreateUserDTO = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: generateValidPassword(),
    };

    await createUserUseCase.execute(userProps);

    await expect(createUserUseCase.execute(userProps)).rejects.toThrow(UserAlreadyExistError);
  });
});
