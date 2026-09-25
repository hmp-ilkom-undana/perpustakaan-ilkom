import { IsUUID, IsNotEmpty } from 'class-validator';

export class RequestBorrowDto {
  @IsUUID('4', { message: 'archiveId harus berupa UUID yang valid' })
  @IsNotEmpty({ message: 'archiveId tidak boleh kosong' })
  archiveId: string;
}
