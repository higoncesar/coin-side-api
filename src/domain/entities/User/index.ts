import { Entity } from '@/domain/entities/_shared/Entity';
import { UniqueEntityId } from '@/domain/entities/_shared/UniqueEntityId';
import { Email } from '@/domain/value-object/Email';
import { Password } from '@/domain/value-object/Password';

interface UserProps {
  name: string;
  email: Email;
  passwordHash: Password;
  createdAt?: Date;
}
export interface UserPrimitives {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    return new User(props, id);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  setName(name: string) {
    this.props.name = name;
  }

  setEmail(email: Email) {
    this.props.email = email;
  }

  toPrimitive(): UserPrimitives {
    return {
      id: this.id.getValue(),
      name: this.name,
      email: this.email.getValue(),
      passwordHash: this.passwordHash.getValue(),
      createdAt: this.createdAt,
    };
  }
}
