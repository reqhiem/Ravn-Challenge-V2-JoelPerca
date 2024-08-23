import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundTokenError } from 'src/lib/constants';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getOrGenerate(email: string): Promise<{ token: string; user: User }> {
    const user = await this.getUserByEmail(email);
    try {
      const previousToken = await this.getToken(user.id);
      return previousToken;
    } catch (error) {
      if (error instanceof NotFoundTokenError) {
        return this.createToken(email, user.id);
      }
    }
  }

  private async getToken(
    userId: number,
  ): Promise<{ token: string; user: User }> {
    const token = await this.prismaService.token.findFirst({
      where: { userId: userId, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!token) {
      throw new NotFoundTokenError('Token not found');
    }
    return { token: token.token, user: token.user };
  }

  private getUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
  }

  private async createToken(
    email: string,
    userId: number,
  ): Promise<{
    token: string;
    user: User;
  }> {
    const BCRYPT_SALT_ROUNDS =
      this.configService.get<number>('bcryptSaltRounds');
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedEmail = await bcrypt.hash(email, salt);

    const EXPIRATION_TIME = this.configService.get<number>(
      'token.expirationTime',
    );
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.getTime() + EXPIRATION_TIME);

    const generatedToken = await this.prismaService.token.upsert({
      where: { token: hashedEmail },
      update: { expiresAt },
      create: { token: hashedEmail, expiresAt, userId: userId },
      include: { user: true },
    });

    return generatedToken;
  }
}
