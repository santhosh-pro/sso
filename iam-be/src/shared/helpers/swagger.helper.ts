import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

function addOperationIdToDescription(document: any) {
  Object.keys(document.paths).forEach((path) => {
    Object.keys(document.paths[path]).forEach((method) => {
      const operation = document.paths[path][method];
      if (operation.operationId) {
        operation.description = `Operation ID: ${operation.operationId}\n\n${operation.description || ''}`;
      }
    });
  });
}

export function setupSwagger(
  prefix: string,
  pathPrefixes: string[],
  title: string,
  description: string,
  urlPath: string,
  app: INestApplication<any>,
) {
  app.use('/static', express.static(path.join(__dirname, '..', '/static')));

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(`${description}`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  addOperationIdToDescription(document);

  const titleOptions = {
    customCss: `
    .swagger-ui .info p img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 10px auto;
    }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .models { display: none !important; } /* Hides the Schemas section */
    .swagger-ui .info h2 { display: none; } /* Hides the title */
    .swagger-ui .info h1 { font-size: 28px; color: #1a1a1a; font-weight: bold; } /* Customize title */
    .swagger-ui .info p { font-size: 18px; font-weight: bold; color: #333; } /* Increases font size of description */
    .swagger-ui .opblock { border-radius: 10px; background: #fff; } /* Round API blocks */
  `,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API Documentation',
  };

  const filteredPaths = Object.keys(document.paths).reduce((acc, path) => {
    if (
      pathPrefixes.some((prefix) => path.startsWith(prefix)) ||
      path.startsWith(`/${prefix}`)
    ) {
      acc[path] = document.paths[path];
    }
    return acc;
  }, {});
  document.paths = filteredPaths;

  SwaggerModule.setup(urlPath, app, document, titleOptions);
}
