import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateModuleItemDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  order: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  source?: string;
}
