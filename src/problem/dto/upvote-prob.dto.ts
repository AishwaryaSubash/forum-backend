import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class UpvoteProblemDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}

export interface UpvoteProblem extends UpvoteProblemDto {}
export type UpvoteProblemType = Node<Integer, UpvoteProblem>;
export interface UpvoteProblemInterface {
  p: UpvoteProblemType;
}
