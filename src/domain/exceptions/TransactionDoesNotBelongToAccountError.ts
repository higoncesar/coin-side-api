import { DomainException } from '@/domain/_shared/DomainException';

export class TransactionDoesNotBelongToAccountError extends DomainException {
  constructor() {
    super('Transaction does not belong to this account');
  }
}
