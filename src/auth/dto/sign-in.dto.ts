import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';
export class SignInDto {
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6)
  @ApiProperty()
  password: string;
}
