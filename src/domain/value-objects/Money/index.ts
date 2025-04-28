import Dinero, { Dinero as DineroType } from 'dinero.js';
import { ValueObject } from '@/domain/_shared/ValueObject';

interface MoneyProps {
  amount: number;
}

export class Money extends ValueObject<MoneyProps> {
  private readonly dinero: DineroType;

  private constructor(props: MoneyProps) {
    super(props);
    this.dinero = this.dinero = Dinero({
      amount: props.amount,
      currency: 'BRL',
      precision: 2,
    });
  }

  static create(amount: number): Money {
    return new Money({ amount: Math.round(amount * 100) });
  }

  static zero() {
    return new Money({ amount: 0 });
  }

  add(other: Money) {
    const result = this.dinero.add(other.dinero);
    return new Money({
      amount: result.getAmount(),
    });
  }

  subtract(other: Money) {
    const result = this.dinero.subtract(other.dinero);
    return new Money({
      amount: result.getAmount(),
    });
  }

  multiply(other: Money) {
    const result = this.dinero.multiply(other.getValue());
    return new Money({
      amount: result.getAmount(),
    });
  }

  divide(other: Money) {
    const divisor = other.getValue();
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }

    const result = this.dinero.divide(divisor);
    return new Money({
      amount: result.getAmount(),
    });
  }

  isGreaterThan(other: Money) {
    return this.dinero.greaterThan(other.dinero);
  }

  isLessThan(other: Money) {
    return this.dinero.lessThan(other.dinero);
  }

  isZero() {
    return this.getValue() === 0;
  }

  isNegative() {
    return this.dinero.isNegative();
  }

  getAmount() {
    return this.dinero.getAmount();
  }

  getValue() {
    return this.getAmount() / 100;
  }
}
