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
    'Deploy',
    ['/', '/common/'],
    'API',
    `
  <h3>📌 Welcome to the <strong>Deploy Module</strong> 🚀</h3>
  `,
    'docs',
    app,
  );

  app.enableCors({
    origin: true, // Allow both origins
    credentials: true, // Allow credentials (cookies, sessions)
    methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  });
  
  // app.enableCors({
  //   origin: ['http://localhost:4200', 'http://localhost:7000'], // Allow the frontend domains
  //   credentials: true, // Allow sending cookies with the request
  //   methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary methods
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  // });

  // app.use((req, res, next) => {
  //   if (req.method === 'OPTIONS') {
  //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7000'); // or localhost:4200 depending on origin
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //     res.setHeader('Access-Control-Allow-Credentials', 'true');
  //     return res.status(204).end();
  //   }
  
  //   // Set headers for the redirect (if necessary)
  //   if (req.url.includes('protocol/openid-connect/auth')) {
  //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // Frontend domain
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //     res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   }
  
  //   next();
  // });

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

  app.use(cookieParser());
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax', // Or 'none' with secure: true for cross-origin
        httpOnly: true, // Prevent client-side access to the cookie
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
