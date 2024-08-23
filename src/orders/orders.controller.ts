import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { HasRoles } from 'src/auth/decorator/has-roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { AddProductsDto } from './dto/add-products.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Post('new')
  new(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.new(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch('add-product')
  add(@Body() addProdcutsDto: AddProductsDto, @Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.add(user.id, addProdcutsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Get('my')
  my(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.my(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.CLIENT)
  @Patch('buy')
  buy(@Req() request: Request) {
    const user = request.user as User;
    return this.ordersService.buy(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
