import { describe, it, expect } from 'vitest';
import { Money } from '..';

describe('Money', () => {
  it('should create a Money object from amount', () => {
    const money = Money.create(100.5);

    expect(money.getValue()).toStrictEqual(100.5);
  });

  it('should return a Money amount', () => {
    const amount = 100.53;
    const money = Money.create(amount);

    expect(money.getAmount()).toStrictEqual(amount * 100);
  });

  it('should add two Money objects', () => {
    const money1 = Money.create(50.25);
    const money2 = Money.create(25.75);

    const total = money1.add(money2);

    expect(total.getValue()).toStrictEqual(76.0);
  });

  it('should subtract two Money objects', () => {
    const money1 = Money.create(100);
    const money2 = Money.create(40);

    const result = money1.subtract(money2);

    expect(result.getValue()).toStrictEqual(60.0);
  });

  it('should multiply a Money object', () => {
    const money = Money.create(20);
    const value = Money.create(3);

    const multiplied = money.multiply(value);

    expect(multiplied.getValue()).toStrictEqual(60.0);
  });

  it('should divide a Money object', () => {
    const money = Money.create(100);
    const value = Money.create(4);

    const divided = money.divide(value);

    expect(divided.getValue()).toStrictEqual(25.0);
  });

  it('should throw error when dividing by zero', () => {
    const money = Money.create(100);
    const zeroValue = Money.create(0);

    expect(() => money.divide(zeroValue)).toThrow('Cannot divide by zero');
  });

  it('should detect greater than', () => {
    const money1 = Money.create(100);
    const money2 = Money.create(50);

    expect(money1.isGreaterThan(money2)).toStrictEqual(true);
  });

  it('should detect less than', () => {
    const money1 = Money.create(20);
    const money2 = Money.create(40);

    expect(money1.isLessThan(money2)).toStrictEqual(true);
  });

  it('should detect zero', () => {
    const zeroMoney = Money.zero();

    expect(zeroMoney.isZero()).toStrictEqual(true);
  });

  it('should create a negative Money value', () => {
    const negativeAmount = -150.75;
    const money = Money.create(negativeAmount);

    expect(money.getValue()).toStrictEqual(negativeAmount);
  });

  it('should return if the Money value is negative', () => {
    const positiveMoney = Money.create(100);
    const negativeMoney = Money.create(-50);

    expect(positiveMoney.isNegative()).toBeFalsy();
    expect(negativeMoney.isNegative()).toBeTruthy();
  });
});
