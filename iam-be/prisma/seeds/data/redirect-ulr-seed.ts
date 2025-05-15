import { RedirectURL } from '@prisma/client';

type RedirectURLSeed = Omit<
  RedirectURL,
  | 'createdBy'
  | 'createdAt'
  | 'createdIp'
  | 'updatedBy'
  | 'updatedAt'
  | 'updatedIp'
> &
  Partial<RedirectURL>;

export const redirectUrlSeeds: RedirectURLSeed[] = [
  {
    id: 'redirect-url1-id',
    url: 'http://localhost:4201/callback',
    clientId: 'app1',
  },
  {
    id: 'redirect-url2-id',
    url: 'http://localhost:4202/callback',
    clientId: 'app2',
  },
   {
    id: 'redirect-url3-id',
    url: 'http://localhost:7000/callback',
    clientId: 'iam',
  },
];
