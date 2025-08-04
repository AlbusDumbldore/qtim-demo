import { applyDecorators, Type } from '@nestjs/common';
import { plainToInstance, Transform } from 'class-transformer';
import { ValidateNested } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TransformNestedConfig = (dto: Type<any>) => {
  return applyDecorators(
    ValidateNested(),
    Transform(({ value }) => plainToInstance(dto, value)),
  );
};
