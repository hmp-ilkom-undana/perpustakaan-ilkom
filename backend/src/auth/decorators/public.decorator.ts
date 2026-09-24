import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Dekorator untuk menandai suatu route sebagai publik (tidak memerlukan autentikasi).
 * Digunakan bersama AuthGuard untuk mengecualikan route tertentu dari pengecekan sesi.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
