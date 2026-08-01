import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class DriveService {
  private drive;
  private readonly FOLDER_PEMINJAMAN = '1mwO7NrhDGxls3wnjPRWMgp7eYS4_oqQX';
  private readonly FOLDER_PENGEMBALIAN = '1UP3oDc2PnIt7HtV1tdKPEsr1GdXMuIzo';

  constructor() {
    try {
      const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
      const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      this.drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      console.error('Failed to initialize Google Drive client:', error);
    }
  }

  async uploadPhoto(file: Express.Multer.File, fileName: string, type: 'PEMINJAMAN' | 'PENGEMBALIAN'): Promise<string> {
    if (!this.drive) {
      throw new InternalServerErrorException('Google Drive client is not initialized.');
    }

    const folderId = type === 'PEMINJAMAN' ? this.FOLDER_PEMINJAMAN : this.FOLDER_PENGEMBALIAN;

    try {
      const requestBody = {
        name: fileName,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      };

      const response = await this.drive.files.create({
        requestBody,
        media,
        fields: 'id',
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new InternalServerErrorException('Gagal mengunggah foto ke Google Drive');
    }
  }
}
