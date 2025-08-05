import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseBodyDto {
  @ApiProperty({ example: 10 })
  public total: number;

  @ApiProperty({ example: 10 })
  public limit: number;

  @ApiProperty({ example: 0 })
  public offset: number;
}
