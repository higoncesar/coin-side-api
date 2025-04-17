import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import { Entity } from '..';

class FakeEntity extends Entity<{ name: string }> {
  get name() {
    return this.props.name;
  }

  toPrimitive() {
    return {
      id: this.id.getValue(),
      name: this.name,
    };
  }
}

describe('Entity', () => {
  it('should be able to create an entity', () => {
    const name = faker.person.fullName();
    const entity = new FakeEntity({ name });

    expect(entity.id).toBeDefined();
    expect(entity.name).toStrictEqual(name);
  });

  it('should be able to compare entities', () => {
    const name = faker.person.fullName();
    const entity1 = new FakeEntity({ name });
    const entity2 = new FakeEntity({ name });
    const entity3 = new FakeEntity({ name: faker.person.fullName() });

    expect(entity1.equals(entity2)).toBeTruthy();
    expect(entity1.equals(entity3)).toBeFalsy();
    expect(entity1.equals(undefined as unknown as FakeEntity)).toBeFalsy();
  });
});
