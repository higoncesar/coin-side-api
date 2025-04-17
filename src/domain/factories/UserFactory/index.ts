import { User } from '@/domain/entities/User';
import { Email } from '@/domain/value-object/Email';
import { Password } from '@/domain/value-object/Password';

interface UserFactoryProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

export class UserFactory {
  static create(props: UserFactoryProps) {
    const name = props.name;
    const email = Email.create(props.email);
    const passwordHash = Password.create(props.passwordHash);
    const createdAt = props.createdAt || new Date();

    return User.create({
      name,
      email,
      passwordHash: passwordHash,
      createdAt: createdAt,
    });
  }
}
