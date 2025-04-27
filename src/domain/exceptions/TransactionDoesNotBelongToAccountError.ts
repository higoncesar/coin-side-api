import { DomainException } from './DomainException';

export class TransactionDoesNotBelongToAccountError extends DomainException {
  constructor() {
    super('Transaction does not belong to this account');
  }
}
