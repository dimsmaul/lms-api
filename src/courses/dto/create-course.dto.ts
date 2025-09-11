import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  passingScore?: number;

  @IsString()
  @IsOptional()
  trainerIds?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  participantIds?: string;

  @IsOptional()
  thumbnailUrl?: string;
}
