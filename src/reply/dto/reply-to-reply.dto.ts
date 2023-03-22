import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class ReplyToReplyDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  existingReplyId: string;

  @IsString()
  @IsNotEmpty()
  newReply: string;
}

export interface ReplyToReply extends ReplyToReplyDto {}
export type ReplyToReplyType = Node<Integer, ReplyToReply>;
export interface ReplyToReplyInterface {
  r: ReplyToReplyType;
}
