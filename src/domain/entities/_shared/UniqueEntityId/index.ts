import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id || randomUUID();
  }

  getValue() {
    return this._value;
  }

  isEqual(id: string) {
    return this._value === id;
  }
}
