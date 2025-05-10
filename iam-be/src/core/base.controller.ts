import { PrismaService } from '@db/prisma.service';
import { Inject } from '@nestjs/common';
import appConfig, { AppConfig } from 'src/config';

export class BaseController {
  @Inject(appConfig.KEY) public readonly appConfig: AppConfig;
  @Inject() public prismaService: PrismaService;
}
