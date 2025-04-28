export class ParentCategoryDoesNotExistError extends Error {
  constructor() {
    super('Parent category does not exist');
    this.name = 'ParentCategoryDoesNotExistError';
  }
}
