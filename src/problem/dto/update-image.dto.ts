import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class UpdateImageDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  problemImg: string;
}

export interface UpdateImage extends UpdateImageDto {}
export type UpdateImageType = Node<Integer, UpdateImage>;
export interface UpdateImageInterface {
  p: UpdateImageType;
}
