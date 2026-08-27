import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    const config = new DocumentBuilder()
        .setTitle('TransitOne Core API')
        .setDescription('The mobility orchestration platform backend services for passengers, operators, and employees.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`TransitOne Backend listening on port ${port}`);
    console.log(`OpenAPI documentation available at http://localhost:${port}/docs`);
}
await bootstrap();
//# sourceMappingURL=main.js.map