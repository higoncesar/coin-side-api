import { faker } from '@faker-js/faker';
import { CreateUserDTO } from '@/application/dtos/User/CreateUserDTO';
import { UserFactory } from '@/domain/User/factories/UserFactory';
import { generateValidPassword } from '@/tests/utils/generatePassword';

type Props = CreateUserDTO & { createdAt: Date };

export function makeUser(prop: Partial<Props> = {}) {
  const name = prop.name ?? faker.person.fullName();
  const email = prop.email ?? faker.internet.email();
  const passwordHash = prop.password ?? generateValidPassword();
  const createdAt = prop.createdAt ?? faker.date.past();

  return UserFactory.create({ name, email, passwordHash, createdAt });
}
