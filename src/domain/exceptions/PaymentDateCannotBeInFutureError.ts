export class PaymentDateCannotBeInFutureError extends Error {
  constructor() {
    super('Payment date cannot be in the future.');
    this.name = 'PaymentDateCannotBeInFutureError';
  }
}
