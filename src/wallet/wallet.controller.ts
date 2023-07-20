import { Controller, Post, Body, UseGuards, UseFilters } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_WALLET_SUMMARY } from './wallet.constants';
import { MongoExceptionFilter, Role, Wallet } from '@app/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { GetCurrentUser } from '@user/decorator/user.decorator';
import { Types } from 'mongoose';
import { TransferDto } from './dto/transfer.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('wallet')
@UseFilters(MongoExceptionFilter)
@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: SWAGGER_WALLET_SUMMARY.ACCOUNT_CREATION })
  @ApiCreatedResponse({
    type: Wallet,
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateWalletDto })
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  @Post('/create-wallet')
  public async createAccount(
    @Body() createWalletDto: CreateWalletDto,
    @GetCurrentUser('userId') userId: Types.ObjectId,
  ) {
    return this.walletService.createAccount(createWalletDto, userId);
  }

  @ApiOperation({ summary: SWAGGER_WALLET_SUMMARY.ACCOUNT_CREATION })
  @ApiCreatedResponse({
    type: Wallet,
  })
  @ApiBearerAuth()
  @ApiBody({ type: TransferDto })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
  @Post('/transfer')
  public async transferFunds(
    @Body() transferDto: TransferDto,
    @GetCurrentUser('userId') userId: Types.ObjectId,
  ) {
    return this.walletService.transferFunds(transferDto, userId);
  }
}
