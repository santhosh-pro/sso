import { Client } from '@prisma/client';

type ClientSeed = Omit<
  Client,
  | 'createdBy'
  | 'createdAt'
  | 'createdIp'
  | 'updatedBy'
  | 'updatedAt'
  | 'updatedIp'
> &
  Partial<Client>;

export const clientSeeds: ClientSeed[] = [
  {
    id: 'app1',
    name: 'My Awesome App',
    clientId: 'app1',
    clientSecret: '$2a$12$8zR9Tx1ZyTLUyjOrk5dyfOIv.mhQHl5FwP2nZZ48Q7/OqpdIm0o3e',
  },
  {
    id: 'app2',
    name: 'Another Awesome App',
    clientId: 'app2',
    clientSecret: '$2a$12$z1KcYg7Xq5sWnpnOlcCq6fR4ONjqXfyzD9i8GpRJ79sDF5FumEcuy',
  },
  {
    id: 'iam',
    name: 'Another Awesome App',
    clientId: 'iam',
    clientSecret: '$2a$12$z1KcYg7Xq5sWnpnOlcCq6fR4ONjqXfyzD9i8GpRJ79sDF5FumEcuy',
  },
];
