import {
  Global,
  Module,
  DynamicModule,
  Provider,
  ExecutionContext,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthStrategy } from './jwt/jwt.strategy';
import { AuthorizeGuard } from './authorize.gurad';

export interface AuthModuleOptions {
  jwtSecret: string;
  jwtExpire: string;
  userAccessControlKey: string;
}

export interface AuthModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<AuthModuleOptions> | AuthModuleOptions;
  inject?: any[];
  imports?: any[];
}

@Global()
@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: options.jwtSecret,
          signOptions: { expiresIn: options.jwtExpire },
        }),
      ],
      providers: [
        AuthService,
        JwtAuthStrategy,
        {
          provide: 'AUTH_OPTIONS',
          useValue: {
            ...options,
            getCurrentUser: (context: ExecutionContext) => {
              const request = context.switchToHttp().getRequest();
              return request.user; // Ensure `user` is attached to the request
            },
          },
        },
        {
          provide: AuthorizeGuard,
          useFactory: (
            authOptions: AuthModuleOptions & {
              getCurrentUser: (context: ExecutionContext) => any;
            },
          ) => {
            return new AuthorizeGuard(new Reflector(), authOptions);
          },
          inject: ['AUTH_OPTIONS'],
        },
      ],
      exports: ['AUTH_OPTIONS', AuthService, JwtModule, AuthorizeGuard],
    };
  }

  static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: AuthModule,
      imports: [
        ...(options.imports || []),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          useFactory: async (authOptions: AuthModuleOptions) => ({
            secret: authOptions.jwtSecret,
            signOptions: { expiresIn: authOptions.jwtExpire },
          }),
          inject: ['AUTH_OPTIONS'],
        }),
      ],
      providers: [
        ...asyncProviders,
        AuthService,
        JwtAuthStrategy,
        {
          provide: AuthorizeGuard,
          useFactory: (
            authOptions: AuthModuleOptions & {
              getCurrentUser: (context: ExecutionContext) => any;
            },
          ) => {
            return new AuthorizeGuard(new Reflector(), authOptions);
          },
          inject: ['AUTH_OPTIONS'],
        },
      ],
      exports: ['AUTH_OPTIONS', AuthService, JwtModule, AuthorizeGuard],
    };
  }

  private static createAsyncProviders(
    options: AuthModuleAsyncOptions,
  ): Provider[] {
    return [
      {
        provide: 'AUTH_OPTIONS',
        useFactory: async (...args: any[]) => {
          const authOptions = await options.useFactory(...args);
          return {
            ...authOptions,
            getCurrentUser: (context: ExecutionContext) => {
              const request = context.switchToHttp().getRequest();
              return request.user; // Ensure `user` is attached to the request
            },
          };
        },
        inject: options.inject || [],
      },
    ];
  }
}
