import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  reactions: string[];
}

export interface CreateReply extends CreateReplyDto {}
export type CreateReplyType = Node<Integer, CreateReply>;
export interface CreateReplyInterface {
  u: CreateReplyType;
}
