import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundTokenError } from '../lib/constants';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getOrGenerate(
    userInstance: User,
  ): Promise<{ token: string; user: User }> {
    try {
      const previousToken = await this.getToken(userInstance.id);
      return previousToken;
    } catch (error) {
      if (error instanceof NotFoundTokenError) {
        return this.createOrUpdate(userInstance);
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

  private async createOrUpdate(userInstance: User): Promise<{
    token: string;
    user: User;
  }> {
    const BCRYPT_SALT_ROUNDS =
      this.configService.get<number>('bcryptSaltRounds');
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);

    const payload = { user: userInstance, timestamp: new Date() };
    const payloadStringified = JSON.stringify(payload);
    const hashedPayload = await bcrypt.hash(payloadStringified, salt);

    const EXPIRATION_TIME = this.configService.get<number>(
      'token.expirationTime',
    );
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.getTime() + EXPIRATION_TIME);

    const generatedToken = await this.prismaService.token.upsert({
      where: { userId: userInstance.id },
      update: { token: hashedPayload, expiresAt },
      create: { token: hashedPayload, expiresAt, userId: userInstance.id },
      include: { user: true },
    });

    return generatedToken;
  }
}
