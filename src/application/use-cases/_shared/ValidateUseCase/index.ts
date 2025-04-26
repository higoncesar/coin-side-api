import { ZodSchema } from 'zod';

export abstract class ValidatedUseCase<Input, Output> {
  protected abstract schema: ZodSchema<Input>;

  async execute(rawInput: Input): Promise<Output> {
    const input = this.schema.parse(rawInput);
    return this.executeValidated(input);
  }

  protected abstract executeValidated(input: Input): Promise<Output>;
}
