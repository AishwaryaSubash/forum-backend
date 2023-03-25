import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class DeleteProblemDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

export interface DeleteProblem extends DeleteProblemDto {}
export type DeleteProblemType = Node<Integer, DeleteProblem>;
export interface DeleteProblemInterface {
  p: DeleteProblemType;
}
