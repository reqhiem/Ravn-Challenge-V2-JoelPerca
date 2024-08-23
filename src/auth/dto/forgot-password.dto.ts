import { ApiProperty } from '@nestjs/swagger';

export class ForgotPaswordDto {
  @ApiProperty()
  email: string;
}
