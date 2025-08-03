import { BadRequestException, type PipeTransform } from '@nestjs/common';
import z, { ZodError, type ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: z.treeifyError(error),
          message: 'Validation failed',
          statusCode: 400,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
