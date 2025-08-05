import { applyDecorators, Type } from '@nestjs/common';
import { plainToInstance, Transform } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export const TransformNestedConfig = (dto: Type) => {
  return applyDecorators(
    ValidateNested(),
    Transform(({ value }) => plainToInstance(dto, value)),
  );
};
