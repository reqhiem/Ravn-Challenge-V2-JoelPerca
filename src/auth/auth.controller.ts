import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { ForgotPaswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in',
    description: 'Sign in with username and password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({
    summary: 'Sign up',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto): Promise<SignInResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: 'Forgot password',
    description: 'Send password reset email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPaswordDto) {
    const { email } = forgotPasswordDto;
    return this.authService.forgotPassword(email);
  }

  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password with token',
  })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword({ ...resetPasswordDto });
  }
}
