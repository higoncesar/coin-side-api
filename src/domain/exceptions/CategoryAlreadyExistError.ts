export class CategoryAlreadyExistError extends Error {
  constructor() {
    super('Category already exists');
    this.name = 'CategoryAlreadyExistError';
  }
}
