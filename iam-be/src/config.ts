import { ConfigType, registerAs } from '@nestjs/config';

const appConfig = registerAs('app', () => ({
  mode: process.env.MODE!,
  databaseUrl: process.env.DATABASE_URL!,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY!,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY!,
  jwtExpire: process.env.JWT_EXPIRE!,
}));

export default appConfig;
export type AppConfig = ConfigType<typeof appConfig>;
