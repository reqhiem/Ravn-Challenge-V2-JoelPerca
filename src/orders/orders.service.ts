import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductsDto } from './dto/add-products.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto);
    return 'This action adds a new order';
  }

  async new(userId: number) {
    await this.prismaService.order.updateMany({
      where: {
        userId,
        status: 'OPEN',
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return this.prismaService.order.create({
      data: {
        userId,
      },
    });
  }

  async add(userId: number, addProductsDto: AddProductsDto) {
    const activeOrder = await this.activeOrder(userId);
    const { productId, quantity } = addProductsDto;
    return this.prismaService.orderItem.create({
      data: {
        orderId: activeOrder.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async my(userId: number) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId,
        status: 'OPEN',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastOrder = orders[0];
    const totalAmount = lastOrder.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    return {
      ...lastOrder,
      totalAmount,
    };
  }

  async buy(userId: number) {
    const activeOrder = await this.activeOrder(userId);
    const boughtOrder = await this.prismaService.order.update({
      where: {
        id: activeOrder.id,
      },
      data: {
        status: OrderStatus.PAID,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const totalAmount = boughtOrder.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    return {
      ...boughtOrder,
      totalAmount,
    };
  }

  findAll() {
    return this.prismaService.user.findMany({
      where: {
        role: 'CLIENT',
        orders: {
          some: {
            status: 'OPEN',
          },
        },
      },
      include: {
        orders: {
          where: {
            status: 'OPEN',
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async activeOrder(userId: number) {
    const order = await this.prismaService.order.findFirst({
      where: {
        userId,
        status: 'OPEN',
      },
    });

    if (!order) {
      return this.prismaService.order.create({
        data: {
          userId,
        },
      });
    }
    return order;
  }
}
