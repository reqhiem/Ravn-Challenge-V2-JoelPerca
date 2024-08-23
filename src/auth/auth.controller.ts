import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { ForgotPaswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPaswordDto) {
    const { email } = forgotPasswordDto;
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword({ ...resetPasswordDto });
  }
}
