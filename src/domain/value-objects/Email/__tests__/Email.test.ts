import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { Email } from '..';
import { InvalidEmailError } from '@/domain/value-objects/Email/exceptions/InvalidEmailError';

describe('Email', () => {
  it('should create a valid email', () => {
    const value = faker.internet.email();
    const email = Email.create(value);

    expect(email.getValue()).toStrictEqual(value);
  });

  it('should throw an error for invalid email', () => {
    const invalidEmail = 'invalid-email';

    expect(() => {
      Email.create(invalidEmail);
    }).toThrowError(InvalidEmailError);
  });

  it('should compare emails correctly', () => {
    const value = faker.internet.email();
    const email1 = Email.create(value);
    const email2 = Email.create(value);
    const email3 = Email.create(faker.internet.email());

    expect(email1.equals(email2)).toBeTruthy();
    expect(email1.equals(email3)).toBeFalsy();
  });
});
