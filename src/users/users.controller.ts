import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as PrismaUser } from '@prisma/client';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { RetrieveUserDto } from './dto/retrive-user.dto';
import { NotFoundError } from 'rxjs';

type User = PrismaUser;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, type: RetrieveUserDto })
  async findOne(@Param('id') id: string): Promise<User> {
    const user: User = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }
    return user;
  }
}
