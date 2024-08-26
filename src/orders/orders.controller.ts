import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/has-roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { AddProductsDto } from './dto/add-products.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RetrieveOrderDto,
  RetrieveOrderWithItemsDto,
} from './dto/retrieve-orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Create a new order. This endpoint is only accessible to CLIENT role user. Create a new order.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RetrieveOrderDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Post('new')
  new(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.new(user.id);
  }

  @ApiOperation({
    summary: 'Add products to order',
    description:
      'Add products to order. This endpoint is only accessible to CLIENT role user. Add products to order.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveOrderWithItemsDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch('add-product')
  addProduct(@Body() addProdcutsDto: AddProductsDto, @Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.addProduct(user.id, addProdcutsDto);
  }

  @ApiOperation({
    summary: 'Find my orders',
    description:
      'Find my orders. This endpoint is only accessible to CLIENT role user. List all orders of the user.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveOrderWithItemsDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Get('my')
  my(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.my(user.id);
  }

  @ApiOperation({
    summary: 'Buy order',
    description:
      'Buy order. This endpoint is only accessible to CLIENT role user. Buy the order.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveOrderWithItemsDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch('buy')
  buy(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.buy(user.id);
  }

  @ApiOperation({
    summary: 'Find all CLIENT orders',
    description:
      'Find all CLIENT orders. This endpoint is only accessible to MANAGER role user. List all CLIENT orders.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveOrderWithItemsDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({
    summary: 'Find one order',
    description:
      'Find one order by id. This endpoint is only accessible to MANAGER role user. Find one order by id.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RetrieveOrderWithItemsDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
