import { IsNotEmpty, IsString } from 'class-validator';

export class MarkAnswerDto {
  @IsString()
  @IsNotEmpty()
  categName: string;
}
