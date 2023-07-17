import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenController } from './token.controller';
import { TokenService } from './token.service';

import { TokenRepository } from './token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule, RefreshToken, RefreshTokenSchema } from '@app/common';
import { AuthCacheService } from '../auth.cache.service';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    RedisModule,
  ],
  controllers: [TokenController],
  providers: [TokenService, TokenRepository, AuthCacheService],
  exports: [TokenService],
})
export class TokenModule {}
