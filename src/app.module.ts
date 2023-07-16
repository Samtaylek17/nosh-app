import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule } from '@app/common';
import configuration from 'config/configuration';
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    AuthModule,
    RedisModule,
    DatabaseModule,
    // MongooseModule.forFeature([])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
