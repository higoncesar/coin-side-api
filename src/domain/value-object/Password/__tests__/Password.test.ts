import { describe, expect, it } from 'vitest';
import { Password } from '..';

import { InvalidPasswordError } from '@/domain/User/exceptions/InvalidPassword';
import { generateValidPassword } from '@/tests/utils/generatePassword';

describe('Password', () => {
  it('should create a valid password', () => {
    const value = generateValidPassword();
    const password = Password.create(value);

    expect(password.getValue()).toStrictEqual(value);
  });

  it('should throw an error for invalid password', () => {
    const invalidPassword = 'invalidpassword';

    expect(() => {
      Password.create(invalidPassword);
    }).toThrowError(InvalidPasswordError);
  });

  it('should compare passwords correctly', () => {
    const value = generateValidPassword();
    const password1 = Password.create(value);
    const password2 = Password.create(value);
    const otherValue = generateValidPassword();
    const password3 = Password.create(otherValue);

    expect(password1.equals(password2)).toBeTruthy();
    expect(password1.equals(password3)).toBeFalsy();
  });
});
