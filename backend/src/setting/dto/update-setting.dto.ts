import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';

export class UpdateSettingDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  operatingDays?: number[];

  @IsOptional()
  @IsInt()
  @Min(1)
  pickupDurationDays?: number;

  @IsOptional()
  @IsBoolean()
  autoCancelUnpicked?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  loanDurationDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxActiveSkripsi?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxActiveRingkasan?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxActiveNaskah?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lateBaseFine?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  lateThresholdDays?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lateDailyFine?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  damagedFine?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lostFine?: number;

  @IsOptional()
  @IsString()
  adminWaNumber?: string;

  @IsOptional()
  @IsString()
  adminContactName?: string;
}
