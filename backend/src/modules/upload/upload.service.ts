import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
import { Multer } from 'multer';

@Injectable()
export class UploadService {
  async uploadImage(
    file: Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'MedEase' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        }
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // Kết thúc stream
      readableStream.pipe(uploadStream);
    });
  }
}
