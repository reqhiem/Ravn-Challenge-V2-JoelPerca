import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Product } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFilename } from 'src/lib/helper';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBody({
    type: CreateProductDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Product,
  })
  @ApiBearerAuth()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedProductsDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(paginationQuery);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiBody({
    type: UpdateProductDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post(':id/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const filename = generateFilename(file);
          cb(null, filename);
        },
      }),
    }),
  )
  upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productsService.uploadImage(+id, images);
  }
}
