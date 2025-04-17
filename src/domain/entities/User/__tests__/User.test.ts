import { describe, expect, it } from 'vitest';
import { makeUsers } from '@/tests/factories/MakeUsers';

describe('User', () => {
  it('should create a user with valid properties', () => {
    const user = makeUsers();

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
    const user = makeUsers();
    const newName = 'New Name';

    user.setName(newName);

    expect(user.name).toStrictEqual(newName);
  });
});
