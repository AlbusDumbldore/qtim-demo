import { IsString, MinLength } from 'class-validator';

export class JwtConfigDto {
  @IsString()
  @MinLength(6)
  readonly accessSecret: string;

  @IsString()
  @MinLength(6)
  readonly refreshSecret: string;
}
