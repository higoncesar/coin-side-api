import { isBefore, isAfter } from 'date-fns';
import { ValueObject } from '@/domain/_shared/ValueObject';
import { InvalidDateError } from '@/domain/exceptions/InvalidDateError';

interface DomainDateProps {
  date: Date;
}

export class DomainDate extends ValueObject<DomainDateProps> {
  private constructor(props: DomainDateProps) {
    super(props);
  }

  static now() {
    return new DomainDate({ date: new Date() });
  }

  static create(value: Date): DomainDate {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new InvalidDateError();
    }

    const date = new Date(value.getTime());

    return new DomainDate({ date });
  }

  isBefore(other: DomainDate): boolean {
    return isBefore(this.props.date, other.getValue());
  }

  isAfter(other: DomainDate): boolean {
    return isAfter(this.props.date, other.getValue());
  }

  toDate(): Date {
    return new Date(this.props.date.getTime());
  }

  toISOString(): string {
    return this.props.date.toISOString();
  }

  getValue(): Date {
    return this.props.date;
  }
}
