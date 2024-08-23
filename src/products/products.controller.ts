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
  Req,
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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Product } from './entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFilename } from 'src/lib/helper';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/has-roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
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

  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiBearerAuth()
  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.disable(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch(':id/like')
  like(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = request.user as User;
    return this.productsService.like(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch(':id/unlike')
  unlike(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = request.user as User;
    return this.productsService.unlike(id, user.id);
  }
}
