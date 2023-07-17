import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class TransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly toAccountNumber: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
