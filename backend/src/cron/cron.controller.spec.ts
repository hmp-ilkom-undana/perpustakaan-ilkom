import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';

describe('CronController', () => {
  let controller: CronController;
  let cronService: { handleDailyMaintenance: jest.Mock };
  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = { ...originalEnv };
    cronService = {
      handleDailyMaintenance: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronController],
      providers: [
        {
          provide: CronService,
          useValue: cronService,
        },
      ],
    }).compile();

    controller = module.get<CronController>(CronController);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('triggerMaintenance', () => {
    it('harus melempar 500 InternalServerErrorException jika CRON_SECRET belum dikonfigurasi', async () => {
      delete process.env.CRON_SECRET;

      await expect(
        controller.triggerMaintenance('Bearer dummy-secret'),
      ).rejects.toThrow(InternalServerErrorException);

      expect(cronService.handleDailyMaintenance).not.toHaveBeenCalled();
    });

    it('harus melempar 500 InternalServerErrorException jika CRON_SECRET hanya berisi string kosong/spasi', async () => {
      process.env.CRON_SECRET = '   ';

      await expect(
        controller.triggerMaintenance('Bearer dummy-secret'),
      ).rejects.toThrow(InternalServerErrorException);

      expect(cronService.handleDailyMaintenance).not.toHaveBeenCalled();
    });

    it('harus melempar 401 UnauthorizedException jika Authorization header tidak disertakan', async () => {
      process.env.CRON_SECRET = 'valid-test-secret';

      await expect(controller.triggerMaintenance(undefined)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(cronService.handleDailyMaintenance).not.toHaveBeenCalled();
    });

    it('harus melempar 401 UnauthorizedException jika Authorization header salah', async () => {
      process.env.CRON_SECRET = 'valid-test-secret';

      await expect(
        controller.triggerMaintenance('Bearer wrong-secret'),
      ).rejects.toThrow(UnauthorizedException);

      expect(cronService.handleDailyMaintenance).not.toHaveBeenCalled();
    });

    it('harus melempar 401 UnauthorizedException jika format token bukan Bearer', async () => {
      process.env.CRON_SECRET = 'valid-test-secret';

      await expect(
        controller.triggerMaintenance('Basic valid-test-secret'),
      ).rejects.toThrow(UnauthorizedException);

      expect(cronService.handleDailyMaintenance).not.toHaveBeenCalled();
    });

    it('harus berhasil menjalankan maintenance jika Authorization Bearer sesuai', async () => {
      process.env.CRON_SECRET = 'valid-test-secret';

      const result = await controller.triggerMaintenance(
        'Bearer valid-test-secret',
      );

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty(
        'message',
        'Pemeliharaan harian sistem berhasil dijalankan',
      );
      expect(result).toHaveProperty('timestamp');
      expect(cronService.handleDailyMaintenance).toHaveBeenCalledTimes(1);
    });
  });
});
