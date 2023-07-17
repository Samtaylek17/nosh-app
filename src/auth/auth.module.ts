import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from './token/token.module';
import { AuthCacheService } from './auth.cache.service';
import { RedisModule, RedisService } from '@app/common';

@Module({
  imports: [TokenModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService, AuthCacheService, RedisService],
  exports: [TokenModule, AuthCacheService],
})
export class AuthModule {}
