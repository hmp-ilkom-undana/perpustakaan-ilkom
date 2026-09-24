import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Dekorator untuk mendefinisikan peran yang diizinkan mengakses suatu route.
 * Digunakan bersama RolesGuard.
 * @example @Roles('ADMIN', 'PETUGAS')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
