import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  // todo: add duration
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  question?: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  // todo: fix this type on swagger doc
  @ApiPropertyOptional({
    type: [String, Number, Boolean],
  })
  options?: (number | string | boolean)[];

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  marks?: number;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'boolean' }],
  })
  answer?: number | string | boolean;
}
