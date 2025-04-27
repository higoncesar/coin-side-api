import { parseISO, isBefore, isAfter, formatISO } from 'date-fns';
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

  static create(input: string | Date) {
    if (typeof input === 'string') {
      const parsed = parseISO(input);
      if (isNaN(parsed.getTime())) {
        throw new InvalidDateError();
      }
      return new DomainDate({ date: parsed });
    }

    if (isNaN(input.getTime())) {
      throw new InvalidDateError();
    }

    return new DomainDate({ date: input });
  }

  isBefore(other: DomainDate) {
    return isBefore(this.props.date, other.getValue());
  }

  isAfter(other: DomainDate) {
    return isAfter(this.props.date, other.getValue());
  }

  toDate() {
    return new Date(this.props.date.toISOString());
  }

  toISOString() {
    return formatISO(this.props.date);
  }

  getValue() {
    return this.toDate();
  }
}
