import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;
}
