export class TransactionPaymentDateCannotBeInFutureError extends Error {
  constructor() {
    super('Transaction payment date cannot be in the future.');
    this.name = 'TransactionPaymentDateCannotBeInFutureError';
  }
}
