import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { ValueObject } from '..';

class FakeValueObject extends ValueObject<string> {
  getValue() {
    return this.props;
  }
}

describe('ValueObject', () => {
  it('should create a ValueObject instance', () => {
    const value = faker.lorem.word();
    const valueObject = new FakeValueObject(value);
    expect(valueObject.getValue()).toStrictEqual(value);
  });

  it('should compare two ValueObject instances', () => {
    const value = faker.lorem.word();
    const valueObject1 = new FakeValueObject(value);
    const valueObject2 = new FakeValueObject(value);
    const valueObject3 = new FakeValueObject(faker.lorem.word());

    expect(valueObject1.equals(valueObject2)).toBeTruthy();
    expect(valueObject1.equals(valueObject3)).toBeFalsy();
  });
});
