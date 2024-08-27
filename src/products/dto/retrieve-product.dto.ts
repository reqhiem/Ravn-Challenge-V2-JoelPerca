import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ProductImageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RetrieveProductWithImagesDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isDisabled: boolean;

  @ApiProperty({ type: () => [ProductImageDto] })
  images: ProductImageDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RetrieveProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isDisabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
