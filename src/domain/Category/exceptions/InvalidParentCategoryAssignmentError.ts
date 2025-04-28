export class InvalidParentCategoryAssignmentError extends Error {
  constructor() {
    super('Cannot set parent category for a non-subcategory');
    this.name = 'InvalidParentCategoryAssignmentError';
  }
}
