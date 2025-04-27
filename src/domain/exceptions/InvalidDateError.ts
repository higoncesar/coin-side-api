export class InvalidDateError extends Error {
  constructor() {
    super('Invalid date');
    this.name = 'InvalidDateError';
  }
}
