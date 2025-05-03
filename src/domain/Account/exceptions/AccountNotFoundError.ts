import { DomainException } from '@/domain/_shared/DomainException';

export class AccountNotFoundError extends DomainException {
  constructor() {
    super('Account not found');
  }
}
