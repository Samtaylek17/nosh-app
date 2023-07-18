import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('/api');

  initializeSwagger(app);

  await initializeApp(app);
}

const initializeSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Nosh Bank Application')
    .setDescription(
      'A basic bank versioned API with the ability to signup, sign in, and initiate transfersbetween accounts with ExpressJS (Node.js Framework)',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
};

const initializeApp = async (app: INestApplication): Promise<void> => {
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
};

bootstrap();
