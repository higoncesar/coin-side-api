export class TransactionAlreadyCanceledError extends Error {
  constructor() {
    super('Transaction is already canceled.');
    this.name = 'TransactionAlreadyCanceledError';
  }
}
