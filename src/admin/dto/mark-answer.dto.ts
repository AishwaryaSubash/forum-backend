import { IsNotEmpty, IsString } from 'class-validator';

export class MarkAnswerDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  replyId: string;
}
