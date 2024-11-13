import { ValueTransformer } from 'typeorm';

export const BigIntToNumberTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value ? parseInt(value) : null),
};
