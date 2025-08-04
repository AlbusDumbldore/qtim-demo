import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class AppConfigDto {
  @IsInt()
  @Min(1024)
  @Max(65535)
  @Type(() => Number)
  readonly port: number;
}
