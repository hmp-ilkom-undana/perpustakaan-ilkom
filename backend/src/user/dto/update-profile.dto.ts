import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa teks' })
  @MaxLength(100, { message: 'Nama maksimal 100 karakter' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Nomor WhatsApp harus berupa teks' })
  @MaxLength(20, { message: 'Nomor WhatsApp maksimal 20 karakter' })
  wa_number?: string;
}
