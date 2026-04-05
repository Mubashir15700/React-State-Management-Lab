import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { MetricsInterceptor } from './metrics/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new MetricsInterceptor());

  // Enable CORS so React can talk to Nest
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3000);
}
bootstrap();
