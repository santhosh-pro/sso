import { Global, Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
