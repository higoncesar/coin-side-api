import { faker } from '@faker-js/faker/locale/pt_BR';
import { describe, expect, it } from 'vitest';
import { DomainDate } from '..';
import { InvalidDateError } from '@/domain/exceptions/InvalidDateError';

describe('DomainDate', () => {
  it('should create a DomainDate object with the current date', () => {
    const domainDate = DomainDate.now();
    expect(domainDate.getValue().toISOString()).toStrictEqual(new Date().toISOString());
  });

  it('should create a DomainDate object from a valid date string', () => {
    const dateString = faker.date.anytime().toISOString();
    const domainDate = DomainDate.create(dateString);

    expect(domainDate.getValue()).toBeInstanceOf(Date);
    expect(domainDate.getValue().toISOString()).toStrictEqual(dateString);
  });

  it('should create a DomainDate object from a valid Date object', () => {
    const date = new Date();
    const domainDate = DomainDate.create(date);

    expect(domainDate.getValue()).toBeInstanceOf(Date);
    expect(domainDate.getValue().toISOString()).toStrictEqual(date.toISOString());
  });

  it('should throw an error when creating from an invalid date string', () => {
    const invalidDateString = 'invalid-date-string';

    expect(() => DomainDate.create(invalidDateString)).toThrow(InvalidDateError);
  });

  it('should throw an error when creating from an invalid Date object', () => {
    const invalidDate = new Date('invalid-date');

    expect(() => DomainDate.create(invalidDate)).toThrow(InvalidDateError);
  });

  it('should compare two DomainDate objects correctly', () => {
    const date1 = DomainDate.create('2023-01-01');
    const date2 = DomainDate.create('2023-01-02');

    expect(date1.isBefore(date2)).toBeTruthy();
    expect(date2.isAfter(date1)).toBeTruthy();
  });

  it('should return the correct ISO string representation', () => {
    const date = DomainDate.create('2023-01-01');
    const isoString = date.toISOString();

    expect(isoString).toStrictEqual('2023-01-01T00:00:00-03:00');
  });
});
