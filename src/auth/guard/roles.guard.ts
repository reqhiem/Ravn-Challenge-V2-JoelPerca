import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  matchRoles(roles: Role[], user: User) {
    return roles.includes(user.role);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = this.jwtService.verify(token);

      const username = decodedToken.username;
      const user = await this.prismaService.user.findFirstOrThrow({
        where: {
          username,
        },
      });

      const isAuthorized = this.matchRoles(roles, user);

      if (!isAuthorized) {
        throw new UnauthorizedException();
      }

      return isAuthorized;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
