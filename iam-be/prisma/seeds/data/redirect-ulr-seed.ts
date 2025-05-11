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
    url: 'http://localhost:4200',
    clientId: 'app1',
  },
  {
    id: 'redirect-url2-id',
    url: 'http://localhost:4202',
    clientId: 'app2',
  },
];
