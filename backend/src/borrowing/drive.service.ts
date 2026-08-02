import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class DriveService {
  constructor() {
    // Initialize Cloudinary with credentials from .env
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadPhoto(file: Express.Multer.File, fileName: string, type: 'PEMINJAMAN' | 'PENGEMBALIAN'): Promise<string> {
    const folderName = type === 'PEMINJAMAN' ? 'Peminjaman' : 'Pengembalian';
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `Sirkulasi_Perpus/${folderName}`,
          public_id: fileName,
          resource_type: 'image',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(new InternalServerErrorException('Gagal mengunggah foto ke Cloudinary'));
          } else if (result) {
            // Return the secure URL of the uploaded image
            resolve(result.secure_url);
          } else {
            reject(new InternalServerErrorException('Gagal mengunggah foto ke Cloudinary'));
          }
        }
      );

      // Pipe the file buffer into Cloudinary upload stream
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
