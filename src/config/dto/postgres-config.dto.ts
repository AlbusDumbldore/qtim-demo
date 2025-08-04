import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostgresConfigDto {
  @IsString()
  @IsNotEmpty()
  readonly host: string;

  @IsNumber()
  @Type(() => Number)
  readonly port: number;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly database: string;
}
