import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class UserProblemDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export interface UserProblem extends UserProblemDto {}
export type UserProblemType = Node<Integer, UserProblem>;
export interface UserProblemInterface {
  p: UserProblemType;
}
