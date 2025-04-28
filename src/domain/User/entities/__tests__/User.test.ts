import { describe, expect, it } from 'vitest';
import { makeUser } from '@/tests-utils/factories/MakeUser';

describe('User', () => {
  it('should create a user with valid properties', () => {
    const user = makeUser();

    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.passwordHash).toBeDefined();
    expect(user.createdAt).toBeDefined();

    expect(user.toPrimitive()).toStrictEqual({
      id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      passwordHash: user.passwordHash.getValue(),
      createdAt: user.createdAt,
    });
  });

  it('should update the user name', () => {
    const user = makeUser();
    const newName = 'New Name';

    user.setName(newName);

    expect(user.name).toStrictEqual(newName);
  });
});
