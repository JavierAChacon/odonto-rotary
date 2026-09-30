import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { readRequiredEnvironmentVariable } from './app.helper.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  setupSwaggerDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}

function setupSwaggerDocs(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') return;

  const docsBasicAuth = basicAuth({
    users: {
      [readRequiredEnvironmentVariable('DOCS_BASIC_AUTH_USER')]:
        readRequiredEnvironmentVariable('DOCS_BASIC_AUTH_PASSWORD'),
    },
    challenge: true,
  });
  app.use('/docs', docsBasicAuth);
  app.use('/api/auth/reference', docsBasicAuth);
  app.use('/api/auth/open-api/generate-schema', docsBasicAuth);

  const openApiDocumentBuilder = new DocumentBuilder()
    .setTitle('Odonto Rotary API')
    .setDescription(
      'API de Odonto Rotary: verificación de salud y sesión actual. Las rutas de autenticación están en /api/auth/reference.',
    )
    .setVersion('1.0')
    .setOpenAPIVersion('3.1.0')
    .addCookieAuth('better-auth.session_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'better-auth.session_token',
    })
    .addTag('health', 'Verificación de que la API está corriendo')
    .build();
  const openApiDocument = SwaggerModule.createDocument(
    app,
    openApiDocumentBuilder,
  );
  SwaggerModule.setup(
    'docs',
    app,
    cleanupOpenApiDoc(openApiDocument, { version: '3.1' }),
  );
}

await bootstrap();
