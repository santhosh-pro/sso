import { ConfigType, registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  mode: process.env.MODE!,
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpire: process.env.JWT_EXPIRE!,
}));

export default appConfig;
export type AppConfig = ConfigType<typeof appConfig>;
