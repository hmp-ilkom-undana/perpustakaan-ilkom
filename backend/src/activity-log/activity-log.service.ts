import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogInput, GetLogsQueryDto } from './dto/get-logs-query.dto';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(input: CreateLogInput) {
    try {
      return await this.prisma.activityLog.create({
        data: {
          userId: input.userId || null,
          userName: input.userName,
          userRole: input.userRole,
          userEmail: input.userEmail,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId || null,
          description: input.description,
          metadata: input.metadata ? input.metadata : Prisma.JsonNull,
        },
      });
    } catch (error) {
      console.error('[-] Gagal mencatat activity log:', error);
      return null;
    }
  }

  async getLogs(query: GetLogsQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityLogWhereInput = {};

    if (query.role) {
      where.userRole = query.role;
    }

    if (query.action) {
      where.action = query.action;
    }

    if (query.entity) {
      where.entity = query.entity;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (query.search && query.search.trim() !== '') {
      const search = query.search.trim();
      where.OR = [
        { userName: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        { entityId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalLogs, todayLogs, adminLogs, petugasLogs, actionCounts] = await Promise.all([
      this.prisma.activityLog.count(),
      this.prisma.activityLog.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.activityLog.count({
        where: { userRole: Role.ADMIN },
      }),
      this.prisma.activityLog.count({
        where: { userRole: Role.PETUGAS },
      }),
      this.prisma.activityLog.groupBy({
        by: ['action'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 6,
      }),
    ]);

    return {
      totalLogs,
      todayLogs,
      adminLogs,
      petugasLogs,
      topActions: actionCounts.map((item) => ({
        action: item.action,
        count: item._count.id,
      })),
    };
  }
}
