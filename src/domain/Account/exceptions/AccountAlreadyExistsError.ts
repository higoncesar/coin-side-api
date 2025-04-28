import { DomainException } from '@/domain/_shared/DomainException';

export class AccountAlreadyExistsError extends DomainException {
  constructor() {
    super('Account already exists');
  }
}
