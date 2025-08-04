import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { TransformNestedConfig } from '../../decorators';
import { PostgresConfigDto } from './postgres-config.dto';

export class AppConfigDto {
  @IsInt()
  @Min(1024)
  @Max(65535)
  @Type(() => Number)
  readonly port: number;

  @TransformNestedConfig(PostgresConfigDto)
  readonly postgres: PostgresConfigDto;
}
