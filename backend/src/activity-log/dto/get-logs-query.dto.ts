import { Role } from '@prisma/client';

export interface CreateLogInput {
  userId?: string | null;
  userName: string;
  userRole: Role;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string | null;
  description: string;
  metadata?: any;
}

export class GetLogsQueryDto {
  search?: string;
  role?: Role;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  page?: string | number;
  limit?: string | number;
}
