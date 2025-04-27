export class TransactionCanceledCannotBePaidError extends Error {
  constructor() {
    super('Transaction is canceled and cannot be marked as paid.');
    this.name = 'TransactionCanceledCannotBePaidError';
  }
}
