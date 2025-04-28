import { ValueObject } from '@/domain/_shared/ValueObject';
import { InvalidEmailError } from '@/domain/value-objects/Email/exceptions/InvalidEmailError';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(value: string) {
    const email = new Email({ value });
    email.validate();
    return email;
  }

  private validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.props.value)) {
      throw new InvalidEmailError();
    }
  }

  getValue() {
    return this.props.value;
  }
}
