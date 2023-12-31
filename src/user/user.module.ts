import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RedisModule,
  RedisService,
  RefreshToken,
  RefreshTokenSchema,
  User,
  UserSchema,
  Wallet,
  WalletSchema,
} from '@app/common';
import { TokenModule } from '@auth/token/token.module';
import { WalletModule } from '@wallet/wallet.module';
import { UserRepository } from './user.repository';
import { WalletRepository } from '@wallet/wallet.repository';
import { TokenRepository } from '@auth/token/token.repository';
import { AuthCacheService } from '@auth/auth.cache.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    WalletModule,
    TokenRepository,
    UserRepository,
    WalletRepository,
    AuthCacheService,
  ],
  imports: [
    WalletModule,
    RedisModule,
    TokenModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
})
export class UserModule {}
