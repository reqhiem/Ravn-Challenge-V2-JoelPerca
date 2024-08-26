import { ApiProperty } from '@nestjs/swagger';
import { RetrieveProductDto } from './retrieve-product.dto';

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
    type: () => [RetrieveProductDto],
    isArray: true,
  })
  data: RetrieveProductDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
