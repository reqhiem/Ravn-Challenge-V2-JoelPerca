import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

const PAGE = 1;
const PAGE_SIZE = 10;

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : PAGE))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = PAGE;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : PAGE_SIZE))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number = PAGE_SIZE;
}
