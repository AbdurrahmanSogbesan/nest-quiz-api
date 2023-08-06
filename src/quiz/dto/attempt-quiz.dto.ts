import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AttemptQuizDto {
  @IsArray()
  @IsNotEmpty()
  // todo: add valid swagger type for this
  @ApiProperty({
    type: [String, Number, Boolean],
  })
  answers: (number | string | boolean)[];
}
