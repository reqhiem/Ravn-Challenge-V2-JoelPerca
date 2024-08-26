import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  passwordConfirmation: string;
}
