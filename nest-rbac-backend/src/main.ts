import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/interceptors/common-response/http-exception.filter';
import { CommonResponseInterceptor } from './common/interceptors/common-response/common-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.setGlobalPrefix('api'); 


  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  app.useGlobalInterceptors(new CommonResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth() 
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       
      forbidNonWhitelisted: true,
      transform: true,       
    }),
  );

  await app.listen(4000);
  console.log('Server running on http://localhost:4000/api');
}
bootstrap();