import { UniqueEntityId } from '../UniqueEntityId';

export abstract class Entity<T> {
  private readonly _id: UniqueEntityId;
  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityId) {
    this._id = id || new UniqueEntityId();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  equals(entity: Entity<T>) {
    if (entity == null || entity == undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(entity.props);
  }

  abstract toPrimitive(): Record<string, any>;
}
