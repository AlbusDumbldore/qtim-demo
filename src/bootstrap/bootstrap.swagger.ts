import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const bootstrapSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Article API Reference')
    .setVersion(process.env.npm_package_version ?? '0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
};
