import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  order: number;

  @IsNumber()
  @IsOptional()
  assessmentWeight: number;
}
