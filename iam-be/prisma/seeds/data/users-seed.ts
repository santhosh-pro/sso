import { Role, User } from '@prisma/client';

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
    password: '$2a$12$UT5WPPU/6lT3To.egtUR4O6hvYvQNfKo2dGOs0WeCye5DOLhIWxNy', //computer
    firstName: 'Santhosh',
    lastName: 'M',
    phoneNumber: '+91 7550042727',
    isVerified: true,
    isActive: true,
    role: Role.MODRATOR, // Replace 'USER' with the appropriate role value
  },
];
