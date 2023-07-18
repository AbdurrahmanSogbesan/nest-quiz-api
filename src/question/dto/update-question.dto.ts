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
  options?: (number | string | boolean)[];

  @IsNotEmpty()
  @IsOptional()
  marks?: number;

  @IsNotEmpty()
  @IsOptional()
  answer?: number | string | boolean;
}
