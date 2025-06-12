import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => {
        return new BadRequestException(
          errors.map(err => ({
            field: err.property,
            message: err.constraints
              ? Object.values(err.constraints).join(', ')
              : 'Invalid value',
          }))
        );
      },
    })
  );
  app.enableCors();
  await app.listen(process.env.POPRT || 8000);
}
bootstrap();
