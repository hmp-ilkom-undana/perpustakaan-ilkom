import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStaffDto } from './create-staff.dto';

export class CreateBatchStaffDto {
  @IsArray({ message: 'staffList harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  staffList: CreateStaffDto[];
}
