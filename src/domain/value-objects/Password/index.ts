import { ValueObject } from '@/domain/_shared/ValueObject';
import { InvalidPasswordError } from '@/domain/value-objects/Password/exceptions/InvalidPasswordError';
interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static create(value: string) {
    const password = new Password({ value });
    password.validate();
    return password;
  }

  private validate() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[a-zA-Z\d\S]{8,}$/;

    if (!passwordRegex.test(this.props.value)) {
      throw new InvalidPasswordError();
    }
  }

  getValue() {
    return this.props.value;
  }
}
