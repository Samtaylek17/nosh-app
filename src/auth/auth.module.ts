import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { AuthCacheService } from './auth.cache.service';
import {
  RedisModule,
  RedisService,
  RefreshToken,
  RefreshTokenSchema,
  User,
  UserSchema,
} from '@app/common';
import { UserModule } from '@user/user.module';
import { UserService } from '@user/user.service';
import { UserRepository } from '@user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TokenModule,
    RedisModule,
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCacheService,
    RedisService,
    UserService,
    UserRepository,
  ],
  exports: [TokenModule, AuthCacheService],
})
export class AuthModule {}
