import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { Prisma, User } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User not found for ${username}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.generateToken(user);
    return { access_token: token };
  }

  async signUp(data: SignUpDto) {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const payload: Prisma.UserCreateInput = {
      ...data,
      password: hashedPassword,
    };

    const user = await this.prisma.user.create({
      data: payload,
    });

    const token = await this.generateToken(user);
    return { token };
  }

  private async generateToken(user: User) {
    const payload = { username: user.username, sub: user.id };

    return await this.jwtService.signAsync(payload);
  }
}
