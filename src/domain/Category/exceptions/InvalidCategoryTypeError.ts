import { DomainException } from '@/domain/_shared/DomainException';

export class InvalidCategoryTypeError extends DomainException {
  constructor() {
    super('Invalid category type');
  }
}
