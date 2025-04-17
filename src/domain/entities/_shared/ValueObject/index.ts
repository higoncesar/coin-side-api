export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = props;
  }

  equals(valueObject: ValueObject<T>) {
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }

  abstract getValue(): unknown;
}
