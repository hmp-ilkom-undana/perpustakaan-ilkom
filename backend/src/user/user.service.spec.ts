import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Role } from '@prisma/client';
import { verifyPassword } from 'better-auth/crypto';

jest.mock('better-auth/crypto', () => ({
  verifyPassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let prisma: any;
  let activityLogService: any;
  let authService: any;

  const mockUser = {
    id: 'user-1',
    name: 'Administrator',
    email: 'admin@ilkom.com',
    wa_number: '081234567890',
    role: Role.ADMIN,
  };

  const mockStudent = {
    id: 'user-2',
    name: 'Mahasiswa Test',
    email: 'mhs@undana.ac.id',
    wa_number: '081298765432',
    role: Role.MAHASISWA,
  };

  const mockAccount = {
    id: 'acc-1',
    userId: 'user-1',
    providerId: 'credential',
    accountId: 'admin@ilkom.com',
    password: 'hashed-password-123',
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      account: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    activityLogService = {
      createLog: jest.fn().mockResolvedValue({ id: 'log-1' }),
    };

    authService = {
      getAuth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivityLogService, useValue: activityLogService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('updateProfile (SEC-008 & SEC-009)', () => {
    it('harus melempar NotFoundException jika pengguna tidak ditemukan', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('unknown-id', { name: 'Baru' }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('SEC-008: harus menolak (ForbiddenException) jika non-admin mencoba mengubah email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockStudent);

      await expect(
        service.updateProfile(
          mockStudent.id,
          { email: 'newemail@evil.com' },
          mockStudent, // actor is non-admin
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('SEC-008: harus menolak (BadRequestException) jika admin mengubah email sendiri tanpa currentPassword', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.updateProfile(
          mockUser.id,
          { email: 'newadmin@ilkom.com' },
          mockUser, // admin changing self email without currentPassword
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('SEC-008: harus menolak (UnauthorizedException) jika currentPassword salah saat ubah email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.account.findFirst.mockResolvedValue(mockAccount);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.updateProfile(
          mockUser.id,
          { email: 'newadmin@ilkom.com', currentPassword: 'wrong-password' },
          mockUser,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('SEC-008: harus menolak (BadRequestException) jika email baru sudah dipakai pengguna lain', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.account.findFirst.mockResolvedValue(mockAccount);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      prisma.user.findFirst.mockResolvedValue({ id: 'other-user', email: 'taken@ilkom.com' });

      await expect(
        service.updateProfile(
          mockUser.id,
          { email: 'taken@ilkom.com', currentPassword: 'valid-password' },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('SEC-008: harus berhasil memperbarui email admin dengan password valid dan mensinkronkan account', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.account.findFirst.mockResolvedValue(mockAccount);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        email: 'newadmin@ilkom.com',
      });
      prisma.account.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.updateProfile(
        mockUser.id,
        { email: 'newadmin@ilkom.com', currentPassword: 'valid-password' },
        mockUser,
      );

      expect(result.user.email).toBe('newadmin@ilkom.com');
      expect(prisma.account.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id, providerId: 'credential' },
        data: { accountId: 'newadmin@ilkom.com' },
      });
    });

    it('SEC-008: update non-email (name / wa_number) tidak memerlukan currentPassword', async () => {
      prisma.user.findUnique.mockResolvedValue(mockStudent);
      prisma.user.update.mockResolvedValue({
        ...mockStudent,
        name: 'Nama Baru',
        wa_number: '081111111111',
      });

      const result = await service.updateProfile(
        mockStudent.id,
        { name: 'Nama Baru', wa_number: '081111111111' },
        mockStudent,
      );

      expect(result.user.name).toBe('Nama Baru');
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.account.findFirst).not.toHaveBeenCalled();
    });

    it('SEC-009: harus mencatat ActivityLog ketika Administrator memperbarui profil', async () => {
      prisma.user.findUnique.mockResolvedValue(mockStudent);
      prisma.user.update.mockResolvedValue({
        ...mockStudent,
        name: 'Mahasiswa Update Admin',
      });

      await service.updateProfile(
        mockStudent.id,
        { name: 'Mahasiswa Update Admin' },
        mockUser, // actor is ADMIN
      );

      expect(activityLogService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          action: 'UPDATE_PROFILE',
          entity: 'USER',
          entityId: mockStudent.id,
        }),
      );
    });

    it('SEC-009: tidak boleh membuat ActivityLog ketika non-admin memperbarui profilnya sendiri', async () => {
      prisma.user.findUnique.mockResolvedValue(mockStudent);
      prisma.user.update.mockResolvedValue({
        ...mockStudent,
        name: 'Self Update',
      });

      await service.updateProfile(
        mockStudent.id,
        { name: 'Self Update' },
        mockStudent, // actor is MAHASISWA
      );

      expect(activityLogService.createLog).not.toHaveBeenCalled();
    });
  });
});
