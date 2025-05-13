import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RequestContextModule } from './shared/request-context/request-context.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig, { AppConfig } from './config';
import { PrismaModule } from '@db/prisma.module';
import { BcryptModule } from '@bcrypt/bcrypt.module';
import { AuthModule } from '@auth/auth.module';
import { ApiModule } from './feature/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    ApiModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtPrivateKey:
          configService.get<AppConfig>('app')?.jwtPrivateKey ?? 'defaultJwtSecret',
        jwtPublicKey:
          configService.get<AppConfig>('app')?.jwtPublicKey ?? 'defaultJwtPublicKey',
        jwtExpire:
          configService.get<AppConfig>('app')?.jwtExpire ?? 'defaultJwtExpire',
        userAccessControlKey: 'role',
      }),
      inject: [ConfigService],
    }),
    BcryptModule,
    PrismaModule,
    RequestContextModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
