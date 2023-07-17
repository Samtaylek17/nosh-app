import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

import { AUTH_VALIDATION_ERRORS } from '@auth/auth.constants';

export class DeleteUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: AUTH_VALIDATION_ERRORS.MAIL_INCORRECT })
  readonly email: string;
}
