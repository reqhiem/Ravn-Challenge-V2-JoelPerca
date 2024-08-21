import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RetrieveUserDto } from './dto/retrive-user.dto';
import { NotFoundError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
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
