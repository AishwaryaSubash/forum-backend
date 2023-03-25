import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteReplyDto {
  @IsString()
  @IsNotEmpty()
  replyId: string;
}
