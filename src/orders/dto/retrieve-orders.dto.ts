import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
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
  stock: number;
}

export class ProductItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  product: ProductDto;
}

export class OrderUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class RetrieveOrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RetrieveOrderWithItemsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [ProductItemDto] })
  items: ProductItemDto[];

  @ApiProperty({ type: () => OrderUserDto })
  user: OrderUserDto;
}
