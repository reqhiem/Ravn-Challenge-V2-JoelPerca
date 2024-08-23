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
import { ConfigService } from '@nestjs/config';
import { MailgunClient } from 'src/lib/mailgun';
import { MailgunMessageData } from 'mailgun.js';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
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
    const BCRYPT_SALT_ROUNDS =
      this.configService.get<number>('bcryptSaltRounds');
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

  async forgotPassword(emailTo: string) {
    const findUser = await this.prisma.user.findFirst({
      where: { email: emailTo },
    });

    if (!findUser) {
      throw new NotFoundException(`User not found for ${emailTo}`);
    }

    const { token, user } = await this.tokenService.getOrGenerate(emailTo);

    const hostUrl = this.configService.get<string>('hostUrl');
    const resetPasswordUrl = `${hostUrl}/reset-password?token=${token}&userId=${user.email}`;
    await this.sendPasswordResetEmail(emailTo, resetPasswordUrl);
  }

  private generateToken(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.signAsync(payload);
  }

  async changePassword(options: {
    userId: number;
    token: string;
    password: string;
    passwordConfirmation: string;
  }) {
    const { userId, token, password, passwordConfirmation } = options;
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (password !== passwordConfirmation) {
      throw new NotFoundException('Passwords do not match');
    }

    const isTokenValid = await bcrypt.compare(user.email, token);

    if (!isTokenValid) {
      throw new NotFoundException('Invalid token');
    }

    const BCRYPT_SALT_ROUNDS =
      this.configService.get<number>('bcryptSaltRounds');
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      }),
      this.sendPasswordChangeEmail(user.email),
    ]);
  }

  private async sendPasswordResetEmail(
    emailTo: string,
    resetPasswordUrl: string,
  ) {
    const mailgunClient = new MailgunClient();
    const sendEmailPayload: MailgunMessageData = {
      from: 'Sip & Savor Team <mailgun@reqhiem.lat>',
      to: [emailTo],
      subject: 'Reset your password',
      text: 'Reset your password',
      html: `
        <p>Click <a href="${resetPasswordUrl}">here</a> to reset your password</p>
      `,
    };
    await mailgunClient.sendEmail(sendEmailPayload);
  }

  private async sendPasswordChangeEmail(emailTo: string) {
    const mailgunClient = new MailgunClient();
    const sendEmailPayload: MailgunMessageData = {
      from: 'Sip & Savor Team <mailgun@reqhiem.lat>',
      to: [emailTo],
      subject: 'Password changed',
      text: 'Password changed',
      html: `
        <p>Your password has been changed</p>
      `,
    };

    await mailgunClient.sendEmail(sendEmailPayload);
  }
}
