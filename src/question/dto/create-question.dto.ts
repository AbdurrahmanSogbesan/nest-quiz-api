import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  // todo: add duration
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  question: string;

  @IsNotEmpty()
  @ApiProperty()
  marks: number;

  @IsArray()
  @IsNotEmpty()
  // todo: add valid swagger type for this
  @ApiProperty({
    type: [String, Number, Boolean],
  })
  options: (number | string | boolean)[];

  @IsNotEmpty()
  @ApiPropertyOptional({
    oneOf: [{ type: 'number' }, { type: 'string' }, { type: 'boolean' }],
  })
  answer?: number | string | boolean;
}
