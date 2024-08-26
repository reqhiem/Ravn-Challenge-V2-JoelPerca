import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductsDto } from './dto/add-products.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
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

  async addProduct(userId: number, addProductsDto: AddProductsDto) {
    const activeOrder = await this.activeOrder(userId);
    const { productId, quantity } = addProductsDto;

    const productInOrder = activeOrder.items.find(
      (item) => item.productId === productId,
    );

    if (productInOrder) {
      const updatedOrderItem = await this.prismaService.orderItem.update({
        where: {
          id: productInOrder.id,
        },
        data: {
          quantity: productInOrder.quantity + quantity,
        },
        include: {
          product: true,
          order: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              user: true,
            },
          },
        },
      });
      return updatedOrderItem.order;
    }

    const createdOrderItem = await this.prismaService.orderItem.create({
      data: {
        orderId: activeOrder.id,
        productId,
        quantity,
      },
      include: {
        product: true,
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            user: true,
          },
        },
      },
    });
    return createdOrderItem.order;
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
        user: true,
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
        user: true,
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
    return this.prismaService.order.findMany({
      where: {
        status: 'OPEN',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.order.findFirst({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  private async activeOrder(userId: number) {
    const order = await this.prismaService.order.findFirst({
      where: {
        userId,
        status: 'OPEN',
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return this.prismaService.order.create({
        data: {
          userId,
        },
        include: {
          items: true,
        },
      });
    }
    return order;
  }
}
