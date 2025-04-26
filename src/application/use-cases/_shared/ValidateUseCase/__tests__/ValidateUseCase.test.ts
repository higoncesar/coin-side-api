import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ValidatedUseCase } from '..';

interface FakerDTO {
  name: string;
}
const FakeSchema = z.object({ name: z.string().min(1).max(10) });

class FakeUseCase extends ValidatedUseCase<FakerDTO, string> {
  protected schema = FakeSchema;
  protected executeValidated(input: FakerDTO): Promise<string> {
    return new Promise((resolve) => {
      resolve(input.name);
    });
  }
}

describe('ValidateUseCase', () => {
  it('should be able to validate a use case', async () => {
    const useCase = new FakeUseCase();
    const input = { name: 'valid' };
    const result = await useCase.execute(input);
    expect(result).toBe(input.name);
  });

  it('should throw an error if the input is invalid', async () => {
    const useCase = new FakeUseCase();
    const input = { name: 'invalid name that is too long' };
    await expect(useCase.execute(input)).rejects.toThrowError();
  });
});
