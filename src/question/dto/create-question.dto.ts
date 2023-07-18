import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  // todo: add duration
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  marks: number;

  @IsArray()
  @IsNotEmpty()
  options: (number | string | boolean)[];

  @IsNotEmpty()
  answer?: number | string | boolean;
}
