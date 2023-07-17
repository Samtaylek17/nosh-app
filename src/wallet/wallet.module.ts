import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UserRepository } from '@user/user.repository';
import { WalletRepository } from './wallet.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RedisModule,
  RefreshToken,
  RefreshTokenSchema,
  User,
  UserSchema,
  Wallet,
  WalletSchema,
} from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCacheService } from '@auth/auth.cache.service';
import { TokenModule } from '@auth/token/token.module';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    UserRepository,
    WalletRepository,
    JwtService,
    AuthCacheService,
  ],
  imports: [
    RedisModule,
    TokenModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
})
export class WalletModule {}
