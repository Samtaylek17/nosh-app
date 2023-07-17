import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule, RedisService } from '@app/common';
import configuration from 'config/configuration';
// import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    DatabaseModule,
    RedisModule,
    UserModule,
    WalletModule,
    // MongooseModule.forFeature([])
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
