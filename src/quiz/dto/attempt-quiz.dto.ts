import { IsArray, IsNotEmpty } from 'class-validator';

export class AttemptQuizDto {
  @IsArray()
  @IsNotEmpty()
  answers: (number | string | boolean)[];
}
