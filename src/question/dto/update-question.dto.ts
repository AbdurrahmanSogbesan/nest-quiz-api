import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  // todo: add duration
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  question?: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  options?: string[];

  @IsNotEmpty()
  @IsOptional()
  marks?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  answer?: string;
}
