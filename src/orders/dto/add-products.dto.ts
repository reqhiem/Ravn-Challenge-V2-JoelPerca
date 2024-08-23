import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddProductsDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
