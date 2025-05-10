import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { globSync } from 'glob';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class ApiDynamicModule {
  private static readonly logger = new Logger(ApiDynamicModule.name);

  static register(): DynamicModule {
    const controllers = this.loadModules('controller');
    const services = this.loadModules('service');

    return {
      module: ApiDynamicModule,
      imports: [HttpModule],
      controllers,
      providers: services,
    };
  }

  private static loadModules(type: 'controller' | 'service') {
    const files = globSync(join(__dirname, `**/*.${type}.{ts,js}`));

    return files.map((file) => {
      try {
        const module = require(file);
        const exportedItem =
          module.default ||
          Object.values(module).find((exp) => typeof exp === 'function');

        if (!exportedItem) {
          throw new Error(`No valid export found in ${file}`);
        }

        return exportedItem;
      } catch (error) {
        this.logger.error(
          `Error loading ${type} from file: ${file}`,
          error.stack,
        );
        throw error;
      }
    });
  }
}

@Module({
  imports: [ApiDynamicModule.register(),],
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiModule implements NestModule {
  private readonly logger = new Logger(ApiModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.log('Applying API middleware...');
  }
}
