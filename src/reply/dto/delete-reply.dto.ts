import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class DeleteReplyDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  replyId: string;
}

// export interface CreateReply extends CreateReplyDto {}
// export type CreateReplyType = Node<Integer, CreateReply>;
// export interface CreateReplyInterface {
//   u: CreateReplyType;
// }
