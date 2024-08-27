import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddProductsDto {
  @ApiProperty({
    description: 'The ID of the product to add to the order',
    example: 1,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'The quantity of the product to add to the order',
    example: 1,
  })
  @IsNumber()
  quantity: number;
}
