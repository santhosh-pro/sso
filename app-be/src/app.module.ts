import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SsoModule } from './sso/sso.module';

@Module({
  imports: [SsoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
