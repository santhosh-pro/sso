import { User } from '@prisma/client';

type UserSeed = Omit<
  User,
  | 'createdBy'
  | 'createdAt'
  | 'createdIp'
  | 'updatedBy'
  | 'updatedAt'
  | 'updatedIp'
> &
  Partial<User>;

export const userSeeds: UserSeed[] = [
  {
    id: 'bcbbeda1-c832-4349-829e-de771a4c5fd9',
    username: 'iamsanthosh.pro@gmail.com',
    email: 'iamsanthosh.pro@gmail.com',
    password: '$2a$12$LDSNJk4CkDE3xbnHhMSOMOhawkW/0LUcbps1M0QKu3MBp8IuKASkC',
    firstName: 'Santhosh',
    lastName: 'M',
    phoneNumber: '+91 7550042727',
    isVerified: true,
    isActive: true,
  },
];
