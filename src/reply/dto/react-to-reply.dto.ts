import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class ReactToReplyDto {
  @IsString()
  @IsNotEmpty()
  replyId: string;

  @IsString()
  @IsNotEmpty()
  reaction: string;
}

export interface ReactToReply extends ReactToReplyDto {}
export type ReactToReplyType = Node<Integer, ReactToReply>;
export interface ReactToReplyInterface {
  r: ReactToReplyType;
}
