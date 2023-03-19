import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  problemImg: string;

  @IsNumber()
  upvote: number;
}

export interface CreateProblem extends CreateProblemDto {}
export type CreateProblemType = Node<Integer, CreateProblem>;
export interface CreateProblemInterface {
  p: CreateProblemType;
}
