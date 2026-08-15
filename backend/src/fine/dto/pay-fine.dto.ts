import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PayFineDto {
  @IsNotEmpty({ message: 'Metode pembayaran wajib dipilih' })
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
