import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SystemSetting, Role } from '@prisma/client';

@Injectable()
export class SettingService {
  private readonly logger = new Logger(SettingService.name);
  private cachedSetting: SystemSetting | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 Menit In-Memory Cache

  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async getSettings(): Promise<SystemSetting> {
    const now = Date.now();
    if (this.cachedSetting && this.cacheExpiry > now) {
      return this.cachedSetting;
    }

    let setting = await this.prisma.systemSetting.findUnique({
      where: { id: 'DEFAULT' },
    });

    if (!setting) {
      this.logger.log('Pengaturan default belum ada, membuat record DEFAULT...');
      setting = await this.prisma.systemSetting.create({
        data: {
          id: 'DEFAULT',
          operatingDays: [1, 2, 3, 4, 5],
          pickupDurationDays: 3,
          autoCancelUnpicked: true,
          loanDurationDays: 30,
          maxActiveSkripsi: 2,
          maxActiveRingkasan: 1,
          maxActiveNaskah: 1,
          lateBaseFine: 50000,
          lateThresholdDays: 7,
          lateDailyFine: 10000,
          damagedFine: 75000,
          lostFine: 100000,
          adminWaNumber: '082339113591',
          adminContactName: 'Admin Perpustakaan ILKOM',
        },
      });
    }

    this.cachedSetting = setting;
    this.cacheExpiry = now + this.CACHE_TTL_MS;
    return setting;
  }

  async updateSettings(
    dto: UpdateSettingDto,
    updatedByInput?: string | any,
  ): Promise<SystemSetting> {
    const adminName = typeof updatedByInput === 'object' && updatedByInput?.name ? updatedByInput.name : (typeof updatedByInput === 'string' ? updatedByInput : 'Administrator Perpustakaan');
    const adminEmail = typeof updatedByInput === 'object' && updatedByInput?.email ? updatedByInput.email : 'admin@perpus.ilkom';
    const adminRole = typeof updatedByInput === 'object' && updatedByInput?.role ? updatedByInput.role : Role.ADMIN;
    const adminId = typeof updatedByInput === 'object' && updatedByInput?.id ? updatedByInput.id : null;

    const updated = await this.prisma.systemSetting.upsert({
      where: { id: 'DEFAULT' },
      update: {
        ...dto,
        updatedBy: adminName,
      },
      create: {
        id: 'DEFAULT',
        operatingDays: dto.operatingDays ?? [1, 2, 3, 4, 5],
        pickupDurationDays: dto.pickupDurationDays ?? 3,
        autoCancelUnpicked: dto.autoCancelUnpicked ?? true,
        loanDurationDays: dto.loanDurationDays ?? 30,
        maxActiveSkripsi: dto.maxActiveSkripsi ?? 2,
        maxActiveRingkasan: dto.maxActiveRingkasan ?? 1,
        maxActiveNaskah: dto.maxActiveNaskah ?? 1,
        lateBaseFine: dto.lateBaseFine ?? 50000,
        lateThresholdDays: dto.lateThresholdDays ?? 7,
        lateDailyFine: dto.lateDailyFine ?? 10000,
        damagedFine: dto.damagedFine ?? 75000,
        lostFine: dto.lostFine ?? 100000,
        adminWaNumber: dto.adminWaNumber ?? '082339113591',
        adminContactName: dto.adminContactName ?? 'Admin Perpustakaan ILKOM',
        updatedBy: adminName,
      },
    });

    // Invalidate & refresh cache
    this.cachedSetting = updated;
    this.cacheExpiry = Date.now() + this.CACHE_TTL_MS;

    this.logger.log(`Pengaturan sistem berhasil diperbarui oleh ${adminName}`);

    await this.activityLogService.createLog({
      userId: adminId,
      userName: adminName,
      userRole: adminRole,
      userEmail: adminEmail,
      action: 'UPDATE_SETTING',
      entity: 'SYSTEM_SETTING',
      entityId: 'DEFAULT',
      description: `Memperbarui konfigurasi sistem perpustakaan (Durasi pinjam: ${updated.loanDurationDays} hari, Batas ambil: ${updated.pickupDurationDays} hari)`,
      metadata: {
        changes: dto,
        currentSettings: updated,
      },
    });

    return updated;
  }

  countBusinessDays(
    startDate: Date,
    endDate: Date,
    operatingDays: number[] = [1, 2, 3, 4, 5],
  ): number {
    const validDays = operatingDays?.length ? operatingDays : [1, 2, 3, 4, 5];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const target = new Date(endDate);
    target.setHours(0, 0, 0, 0);

    if (target <= current) return 0;

    let count = 0;
    while (current < target) {
      current.setDate(current.getDate() + 1);
      if (validDays.includes(current.getDay())) {
        count++;
      }
    }
    return count;
  }

  addBusinessDays(
    startDate: Date,
    businessDaysToAdd: number,
    operatingDays: number[] = [1, 2, 3, 4, 5],
  ): Date {
    const validDays = operatingDays?.length ? operatingDays : [1, 2, 3, 4, 5];
    const result = new Date(startDate);
    let added = 0;

    while (added < businessDaysToAdd) {
      result.setDate(result.getDate() + 1);
      if (validDays.includes(result.getDay())) {
        added++;
      }
    }
    return result;
  }

  calculateFine(params: {
    returnDate: Date;
    actualDate?: Date;
    kondisi?: string;
    settings?: SystemSetting;
  }): {
    fineAmount: number;
    lateDays: number;
    isLate: boolean;
    lateFine: number;
    damageFine: number;
    lostFine: number;
  } {
    const { returnDate, actualDate = new Date(), kondisi, settings } = params;
    const activeSettings = settings || this.cachedSetting;

    const operatingDays = activeSettings?.operatingDays || [1, 2, 3, 4, 5];
    const lateBaseFine = activeSettings?.lateBaseFine ?? 50000;
    const lateThresholdDays = activeSettings?.lateThresholdDays ?? 7;
    const lateDailyFine = activeSettings?.lateDailyFine ?? 10000;
    const damagedFine = activeSettings?.damagedFine ?? 75000;
    const lostFine = activeSettings?.lostFine ?? 100000;

    let lateDays = 0;
    let lateFine = 0;
    let isLate = false;

    if (actualDate > returnDate) {
      lateDays = this.countBusinessDays(returnDate, actualDate, operatingDays);
      if (lateDays >= 1) {
        isLate = true;
        lateFine = lateBaseFine;
        if (lateDays > lateThresholdDays) {
          const extraDays = lateDays - lateThresholdDays;
          lateFine += extraDays * lateDailyFine;
        }
      }
    }

    let damageFine = 0;
    let lostFineAmount = 0;

    if (kondisi === 'RUSAK') {
      damageFine = damagedFine;
    } else if (kondisi === 'HILANG') {
      lostFineAmount = lostFine;
    }

    const fineAmount = lateFine + damageFine + lostFineAmount;

    return {
      fineAmount,
      lateDays,
      isLate,
      lateFine,
      damageFine,
      lostFine: lostFineAmount,
    };
  }
}
