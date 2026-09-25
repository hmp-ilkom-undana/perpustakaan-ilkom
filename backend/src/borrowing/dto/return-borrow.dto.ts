import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

enum KondisiArsip {
  BAIK = 'BAIK',
  RUSAK = 'RUSAK',
  HILANG = 'HILANG',
}

export class ReturnBorrowDto {
  @IsEnum(KondisiArsip, {
    message: 'kondisiKembali harus salah satu dari: BAIK, RUSAK, HILANG',
  })
  kondisiKembali: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Catatan kondisi maksimal 500 karakter' })
  catatanKondisiKembali?: string;

  @IsOptional()
  @IsString()
  fineAmount?: string;

  @IsOptional()
  returnToStock?: string | boolean;
}
