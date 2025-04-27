export class CategoryIdIsRequiredError extends Error {
  constructor() {
    super('CategoryId is required for non-transfer transactions.');
    this.name = 'CategoryIdIsRequiredError';
  }
}
