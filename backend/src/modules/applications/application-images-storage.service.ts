import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';

type UploadImageInput = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

@Injectable()
export class ApplicationImagesStorageService {
  constructor(private readonly configService: ConfigService) {}

  private buildPublicUrl(key: string) {
    const publicBaseUrl = this.configService.get<string>(
      'AWS_S3_PUBLIC_BASE_URL',
    );
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    const region = this.configService.get<string>('AWS_REGION');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!bucket) {
      throw new BadRequestException('AWS_S3_BUCKET is not configured');
    }

    const normalizedKey = encodeURI(key);

    if (publicBaseUrl) {
      return `${publicBaseUrl.replace(/\/$/, '')}/${normalizedKey}`;
    }

    if (endpoint) {
      return `${endpoint.replace(/\/$/, '')}/${bucket}/${normalizedKey}`;
    }

    if (!region) {
      throw new BadRequestException('AWS_REGION is not configured');
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
  }

  private getS3Client() {
    const region = this.configService.get<string>('AWS_REGION');

    if (!region) {
      throw new BadRequestException('AWS_REGION is not configured');
    }

    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    return new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint),
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });
  }

  async uploadApplicationImage(file: UploadImageInput) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('Image size must be 10MB or less');
    }

    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!bucket) {
      throw new BadRequestException('AWS_S3_BUCKET is not configured');
    }

    const extension = extname(file.originalname || '').toLowerCase();
    const safeExtension = extension || '.jpg';
    const key = `applications/${Date.now()}-${randomUUID()}${safeExtension}`;

    const s3Client = this.getS3Client();
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return this.buildPublicUrl(key);
  }
}
