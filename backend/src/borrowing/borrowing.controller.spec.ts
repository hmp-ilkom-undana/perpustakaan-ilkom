import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';
import { ReturnBorrowDto } from './dto/return-borrow.dto';

describe('BorrowingController', () => {
  let controller: BorrowingController;
  let borrowingService: any;

  beforeEach(async () => {
    borrowingService = {
      returnBorrowing: jest.fn().mockResolvedValue({ success: true }),
      requestBorrowing: jest.fn(),
      getStudentHistory: jest.fn(),
      cancelBorrowing: jest.fn(),
      getActiveLoans: jest.fn(),
      approveBorrowing: jest.fn(),
      rejectBorrowing: jest.fn(),
      handoverBorrowing: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [
        {
          provide: BorrowingService,
          useValue: borrowingService,
        },
      ],
    }).compile();

    controller = module.get<BorrowingController>(BorrowingController);
  });

  describe('returnBorrowing (SEC-015)', () => {
    it('harus memanggil borrowingService.returnBorrowing tanpa field fineAmount dari client', async () => {
      const mockReq = {
        user: { id: 'officer-1', role: 'PETUGAS' },
      } as any;

      const body: ReturnBorrowDto = {
        kondisiKembali: 'BAIK',
        catatanKondisiKembali: 'Kondisi baik terverifikasi',
        returnToStock: true,
      };

      const mockFile = { originalname: 'kembali.jpg' } as any;

      await controller.returnBorrowing('borrow-1', mockReq, body, mockFile);

      expect(borrowingService.returnBorrowing).toHaveBeenCalledWith(
        'borrow-1',
        mockFile,
        'BAIK',
        'Kondisi baik terverifikasi',
        mockReq.user,
        true,
      );
    });
  });
});
