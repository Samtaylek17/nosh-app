import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly accountNumber: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly initialBalance: number;
}
