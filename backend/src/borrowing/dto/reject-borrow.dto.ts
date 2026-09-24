import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectBorrowDto {
  @IsOptional()
  @IsString({ message: 'Alasan penolakan harus berupa teks' })
  @MaxLength(500, { message: 'Alasan penolakan maksimal 500 karakter' })
  reason?: string;
}
