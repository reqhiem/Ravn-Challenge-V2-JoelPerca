import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';

class UserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
export class SignInDto {
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6)
  @ApiProperty()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserDto;
}
