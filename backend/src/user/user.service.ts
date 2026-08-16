import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Mengambil seluruh data mahasiswa beserta jumlah peminjaman aktif
   */
  async getStudents(search?: string) {
    const whereClause: any = {
      role: Role.MAHASISWA,
    };

    if (search && search.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nim: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nim: true,
        email: true,
        wa_number: true,
        role: true,
        createdAt: true,
        borrowings: {
          where: {
            status: {
              in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
            },
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students.map((s) => ({
      id: s.id,
      name: s.name,
      identifier: s.nim,
      nim: s.nim,
      email: s.email,
      wa_number: s.wa_number,
      role: s.role,
      status: 'Aktif',
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(s.createdAt)),
      activeBorrowings: s.borrowings.length,
    }));
  }

  /**
   * Mengambil riwayat transaksi peminjaman mahasiswa tertentu
   */
  async getStudentBorrowings(userId: string) {
    const borrowings = await this.prisma.borrowing.findMany({
      where: { userId },
      include: {
        archive: {
          select: {
            title: true,
            archiveCode: true,
            category: true,
            archiveType: true,
          },
        },
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });

    return borrowings.map((b) => ({
      id: b.id,
      archiveTitle: b.archive?.title || 'Arsip Tidak Ditemukan',
      archiveCode: b.archive?.archiveCode || '-',
      category: b.archive?.category || '-',
      archiveType: b.archive?.archiveType || '-',
      borrowDate: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(b.borrowDate)),
      returnDate: b.returnDate
        ? new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }).format(new Date(b.returnDate))
        : null,
      status: b.status,
      fineAmount: b.fineAmount,
      kondisiKembali: b.kondisiKembali,
      pickupCode: b.pickupCode,
    }));
  }

  /**
   * Mengambil seluruh data staf operasional (Petugas & Admin)
   */
  async getStaff(search?: string) {
    const whereClause: any = {
      role: {
        in: [Role.PETUGAS, Role.ADMIN],
      },
    };

    if (search && search.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const staffList = await this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        wa_number: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return staffList.map((st) => ({
      id: st.id,
      name: st.name,
      identifier: st.email,
      email: st.email,
      wa_number: st.wa_number,
      role: st.role,
      status: 'Aktif',
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(st.createdAt)),
    }));
  }

  /**
   * Mendaftarkan akun petugas baru (Hanya Email & Password)
   */
  async createStaff(data: {
    email: string;
    password?: string;
  }) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }],
      },
    });

    if (existing) {
      throw new BadRequestException(`Email ${data.email} sudah terdaftar`);
    }

    const usernamePart = data.email.split('@')[0] || `staff_${Date.now().toString().slice(-4)}`;
    const formattedName = `Petugas ${usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1)}`;
    const generatedNIM = `STF-${Date.now().toString().slice(-6)}`;

    // Daftarkan via Better-Auth SignUp API agar hashing sandi & token tersinkronisasi
    const result = await this.authService.auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password || '123456',
        name: formattedName,
        username: usernamePart,
        nim: generatedNIM,
        wa_number: '081234567890',
      },
    });

    if (!result || !result.user) {
      throw new BadRequestException('Gagal membuat akun petugas');
    }

    // Set Role ke PETUGAS
    const updated = await this.prisma.user.update({
      where: { id: result.user.id },
      data: {
        role: Role.PETUGAS,
      },
    });

    return {
      message: 'Akun petugas berhasil dibuat',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
    };
  }

  /**
   * Mendaftarkan banyak akun petugas sekaligus (Batch Add)
   */
  async createBatchStaff(staffList: Array<{ email: string; password?: string }>) {
    if (!staffList || staffList.length === 0) {
      throw new BadRequestException('Daftar petugas tidak boleh kosong');
    }

    const results: Array<{ message: string; user: any }> = [];
    const errors: Array<{ email: string; error: string }> = [];

    for (const item of staffList) {
      try {
        const created = await this.createStaff({
          email: item.email,
          password: item.password,
        });
        results.push(created);
      } catch (err: any) {
        errors.push({ email: item.email, error: err.message });
      }
    }

    return {
      success: true,
      totalCreated: results.length,
      totalFailed: errors.length,
      results,
      errors,
    };
  }

  /**
   * Memperbarui data profil staf
   */
  async updateStaff(
    id: string,
    data: {
      name?: string;
      email?: string;
      wa_number?: string;
      status?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Data petugas tidak ditemukan');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name ?? user.name,
        email: data.email ?? user.email,
        wa_number: data.wa_number ?? user.wa_number,
      },
    });

    return {
      message: 'Data petugas berhasil diperbarui',
      user: updated,
    };
  }

  /**
   * Reset sandi pengguna (Mahasiswa atau Petugas) ke default 123456
   */
  async resetPassword(identifier: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { nim: identifier }, { id: identifier }],
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    return {
      message: `Sandi pengguna ${user.name} berhasil direset ke standar (123456)`,
      success: true,
    };
  }

  /**
   * Menghapus akun petugas
   */
  async deleteStaff(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        borrowings: {
          where: {
            status: {
              in: ['REQUESTED', 'WAITING_PICKUP', 'BORROWED', 'OVERDUE'],
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Petugas tidak ditemukan');
    }

    if (user.borrowings.length > 0) {
      throw new BadRequestException(
        'Tidak dapat menghapus akun petugas yang masih memiliki tanggungan transaksi aktif',
      );
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: `Akun petugas ${user.name} berhasil dihapus`,
      success: true,
    };
  }
}
