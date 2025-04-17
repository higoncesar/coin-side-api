import { randomUUID } from 'crypto';
import { describe, expect, it } from 'vitest';
import { UniqueEntityId } from '..';

describe('UniqueEntityId', () => {
  it('should be able to create a UniqueEntityId', () => {
    const uniqueEntityId = new UniqueEntityId();

    expect(uniqueEntityId.getValue()).toBeDefined();
  });

  it('should be able to create a UniqueEntityId with a specific value', () => {
    const id = randomUUID();
    const uniqueEntityId = new UniqueEntityId(id);
    expect(uniqueEntityId.getValue()).toStrictEqual(id);
  });

  it('should be able to compare UniqueEntityIds', () => {
    const id = randomUUID();
    const uniqueEntityId1 = new UniqueEntityId(id);
    const uniqueEntityId2 = new UniqueEntityId(id);
    const uniqueEntityId3 = new UniqueEntityId();

    expect(uniqueEntityId1.isEqual(uniqueEntityId2)).toBeTruthy();
    expect(uniqueEntityId1.isEqual(uniqueEntityId3)).toBeFalsy();
  });
});
