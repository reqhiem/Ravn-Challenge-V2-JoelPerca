import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
