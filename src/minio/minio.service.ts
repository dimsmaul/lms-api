import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';
import { extname } from 'path';
import { getNested, setNested } from 'src/utils/helper/nested';
import { getNestedArray, setNestedArray } from 'src/utils/helper/nested-array';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: process.env.MINIO_PORT
        ? parseInt(process.env.MINIO_PORT, 10)
        : 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });
  }

  async onModuleInit() {
    console.log('MinIO Service Initialized');
  }

  async ensureBucketExists(bucketName: string) {
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket '${bucketName}' created`);
    }
  }
  async uploadFile(
    // bucketName: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ) {
    await this.ensureBucketExists(process.env.MINIO_BUCKET || 'lms-project');
    // await this.ensureBucketExists('lms-project');
    await this.minioClient.putObject(
      process.env.MINIO_BUCKET || 'lms-project',
      // 'lms-project',
      fileName,
      fileBuffer,
      undefined,
      {
        'Content-Type': mimeType,
      },
    );
  }

  async getSignedUrl(
    // bucketName: string,
    fileName: string,
    expiresIn = 60,
  ) {
    const url = await this.minioClient.presignedUrl(
      'GET',
      process.env.MINIO_BUCKET || 'lms-project',
      // 'lms-project',
      fileName,
      expiresIn,
    );

    return url;
  }

  async deleteFile(
    // bucketName: string,
    fileName: string,
  ) {
    await this.minioClient.removeObject(
      process.env.MINIO_BUCKET || 'lms-project',
      // 'lms-project',
      fileName,
    );
  }

  async handleUploadSimplified(prefix: string, file: Express.Multer.File) {
    let ext = '';
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      ext = '.webp';
    } else {
      ext = extname(file.originalname);
    }

    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${ext}`;
    const filePath = `${prefix}/${uniqueFileName}`;
    await this.uploadFile(filePath, file.buffer, file.mimetype);
    return filePath;
  }

  async getListImageSimplified<T extends Record<string, any>>(
    items: T[],
    field: keyof T,
    expiresIn: number = 3600,
  ): Promise<T[]> {
    return Promise.all(
      items.map(async (item) => {
        if (item[field]) {
          const url = await this.getSignedUrl(item[field], expiresIn);
          return { ...item, [field]: url };
        }
        return item;
      }),
    );
  }

  async getListImageSimplifiedMultiList<T extends Record<string, any>>(
    items: T[],
    fields: string | string[],
    expiresIn: number = 3600,
  ): Promise<T[]> {
    return Promise.all(
      items.map((item) =>
        this.getOneImageSimplifiedMulti(item, fields, expiresIn),
      ),
    );
  }

  // async getOneImageSimplified<T extends Record<string, any>>(
  //   item: T,
  //   fields: keyof T | (keyof T)[], // single or multiple
  //   expiresIn: number = 3600,
  // ): Promise<T> {
  //   const fieldList = Array.isArray(fields) ? fields : [fields];

  //   const updatedItem = { ...item };

  //   for (const field of fieldList) {
  //     if (updatedItem[field]) {
  //       updatedItem[field] = (await this.getSignedUrl(
  //         updatedItem[field],
  //         expiresIn,
  //       )) as T[keyof T];
  //     }
  //   }

  //   return updatedItem;
  // }

  async getOneImageSimplifiedMulti<T extends Record<string, any>>(
    item: T,
    fields: string | string[], // allow nested paths
    expiresIn: number = 3600,
  ): Promise<T> {
    const fieldList = Array.isArray(fields) ? fields : [fields];
    const updatedItem = structuredClone(item); // deep copy

    for (const field of fieldList) {
      const current = getNested(updatedItem, field);
      if (current) {
        const url = await this.getSignedUrl(current, expiresIn);
        setNested(updatedItem, field, url);
      }
    }

    return updatedItem;
  }

  // TODO: I think this not needed anymore
  async getOneImageSimplifiedMultiList<T extends Record<string, any>>(
    item: T,
    fields: string | string[],
    expiresIn: number = 3600,
  ): Promise<T> {
    const fieldList = Array.isArray(fields) ? fields : [fields];
    const updatedItem = structuredClone(item);

    for (const field of fieldList) {
      const values = getNestedArray(updatedItem, field);
      for (const val of values) {
        if (val) {
          const url = await this.getSignedUrl(val, expiresIn);
          setNestedArray(updatedItem, field, (old) =>
            old === val ? url : old,
          );
        }
      }
    }

    return updatedItem;
  }
  async getOneImageSimplified<T extends Record<string, any>>(
    item: T,
    field: keyof T,
    expiresIn: number = 3600, // Default to 1 hour
  ): Promise<T> {
    if (item[field]) {
      const url = await this.getSignedUrl(item[field], expiresIn);
      return { ...item, [field]: url };
    }
    return item;
  }
}
