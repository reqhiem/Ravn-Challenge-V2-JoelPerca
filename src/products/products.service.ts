import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  create(createProductDto: CreateProductDto) {
    const payload: Prisma.ProductCreateInput = {
      ...createProductDto,
    };
    return this.prismaService.product.create({
      data: payload,
      include: { images: true },
    });
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedProductsDto> {
    const { page, pageSize } = paginationQuery;

    const skip = (page - 1) * pageSize;

    const [products, count] = await Promise.all([
      this.prismaService.product.findMany({
        skip,
        take: pageSize,
      }),
      this.prismaService.product.count(),
    ]);

    const response: PaginatedProductsDto = {
      data: products,
      pagination: {
        count,
        next: page * pageSize < count ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      },
    };

    return response;
  }

  findOne(id: number) {
    return this.prismaService.product.findFirstOrThrow({
      where: { id },
      include: { images: true },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prismaService.product.delete({ where: { id } });
  }

  async uploadImage(productId: number, images: Express.Multer.File[]) {
    const HOST_URL = this.configService.get<string>('hostUrl');
    const createsManyPayload = images.map((image) => ({
      productId,
      url: `${HOST_URL}/${image.path}`,
    }));

    await this.prismaService.productImage.createMany({
      data: createsManyPayload,
    });

    return this.prismaService.product.findFirstOrThrow({
      where: { id: productId },
      include: { images: true },
    });
  }

  disable(productId: number) {
    return this.prismaService.product.update({
      where: { id: productId },
      data: { isDisabled: true },
    });
  }
}
