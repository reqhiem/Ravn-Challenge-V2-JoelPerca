import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  next: number | null;

  @ApiProperty()
  previous: number | null;
}

export class PaginatedProductsDto {
  @ApiProperty({
    type: () => [Object],
  })
  data: any[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
