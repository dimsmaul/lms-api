import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Rename dengan timestamp agar unik
    const fileExt = extname(file.originalname);
    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${fileExt}`;

    // Upload ke MinIO
    await this.minioService.uploadFile(
      // 'my-bucket',
      uniqueFileName,
      file.buffer,
      file.mimetype,
    );

    // Generate signed URL
    const signedUrl = await this.minioService.getSignedUrl(
      // 'my-bucket',
      uniqueFileName,
      3600,
    );

    return { fileUrl: signedUrl };
  }

  @Get('file/:fileName')
  async getFileUrl(@Param('fileName') fileName: string) {
    const url = await this.minioService.getSignedUrl(
      // 'my-bucket',
      fileName,
      3600,
    );
    return { url };
  }
}