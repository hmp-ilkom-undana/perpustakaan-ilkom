import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateArchiveDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul arsip tidak boleh kosong' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Penulis arsip tidak boleh kosong' })
  author: string;

  @IsNumber()
  @Min(1900, { message: 'Tahun tidak valid' })
  year: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  archiveType: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  shelfLocation?: string;
}
