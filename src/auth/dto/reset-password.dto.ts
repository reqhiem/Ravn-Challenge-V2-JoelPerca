import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  passwordConfirmation: string;
}
