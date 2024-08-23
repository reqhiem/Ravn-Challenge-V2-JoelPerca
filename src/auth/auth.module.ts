import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [PrismaModule, PassportModule, UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
