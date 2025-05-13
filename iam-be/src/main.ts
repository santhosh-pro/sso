import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './shared/helpers/swagger.helper';
import { SanitizeUndefinedPipe } from '@validator/sanitize-undefined.pipe';
import { AppValidationPipe } from '@validator/app-validation.pipe';
import session from 'express-session';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(
    'IAM',
    ['/', '/common/'],
    'API',
    `
  <h3>📌 Welcome to the <strong>IAM</strong> 🚀</h3>
  `,
    'docs',
    app,
  );

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new SanitizeUndefinedPipe(),
    new AppValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
 // app.useGlobalInterceptors(new SnakeToCamelInterceptor());

  app.use(cookieParser());
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
