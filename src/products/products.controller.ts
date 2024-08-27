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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFilename } from 'src/lib/helper';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/has-roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import {
  RetrieveProductWithImagesDto,
  RetrieveProductDto,
} from './dto/retrieve-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create a product',
    description: 'Create a new product',
  })
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
    type: RetrieveProductWithImagesDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Retrieve all products',
    description: 'Retrieve all products with pagination',
  })
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
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by category',
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

  @ApiOperation({
    summary: 'Retrieve a product',
    description: 'Retrieve a product by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductWithImagesDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product by id',
  })
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
    type: RetrieveProductWithImagesDto,
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

  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by id',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductWithImagesDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }

  @ApiOperation({
    summary: 'Upload images for a product',
    description: 'Upload images for a product',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductWithImagesDto,
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

  @ApiOperation({
    summary: 'Disable a product',
    description: 'Disable a product by id. This action requires MANAGER role',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductDto,
  })
  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.disable(id);
  }

  @ApiOperation({
    summary: 'Like a product',
    description: 'Like a product by id. This action requires CLIENT role',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch(':id/like')
  like(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = request.user as User;
    return this.productsService.like(id, user.id);
  }

  @ApiOperation({
    summary: 'Unlike a product',
    description: 'Unlike a product by id. This action requires CLIENT role',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveProductDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch(':id/unlike')
  unlike(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const user = request.user as User;
    return this.productsService.unlike(id, user.id);
  }
}
