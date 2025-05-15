import { Role } from '@prisma/client';

export function getRole(status: Role): string {
    const statusMap: Record<keyof typeof Role, string> = {
        [Role.MEMBER]: 'Member',
        [Role.MODRATOR]: 'Moderator',
        [Role.DEV]: 'Developer',
        [Role.SUPER_ADMIN]: 'Super Admin',
    };

    return statusMap[status] || 'Unknown Status';
}

export const roles = [
    { id: Role.MEMBER, name: 'Member' },
    { id: Role.MODRATOR, name: 'Modrator' },
    { id: Role.DEV, name: 'Developer' },
    { id: Role.SUPER_ADMIN, name: 'Super Admin' },
];
