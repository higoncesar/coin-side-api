export class SubcategoryMatchTypeError extends Error {
  constructor() {
    super('Subcategory type must match the parent category');
    this.name = 'SubcategoryMatchTypeError';
  }
}
