import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfigInit(app: INestApplication): void {
    const document = new DocumentBuilder()
    .setTitle("NestJS Blog API")
    .setDescription("API for a blog application")
    .setVersion("0.0.1")
    .addBearerAuth()
    .build();
    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup(`/swagger`, app, swaggerDocument);
}
