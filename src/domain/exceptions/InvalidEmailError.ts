export class InvalidEmailError extends Error {
  constructor() {
    super(`Invalid email`);
    this.name = 'InvalidEmailError';
  }
}
