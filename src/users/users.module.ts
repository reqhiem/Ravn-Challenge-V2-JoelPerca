import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
