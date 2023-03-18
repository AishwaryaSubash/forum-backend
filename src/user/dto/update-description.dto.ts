import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class updateDescriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc: string;
}

export interface UpdateDesc extends updateDescriptionDto {}
export type UpdateDescType = Node<Integer, UpdateDesc>;
export interface UpdateDescInterface {
  u: UpdateDescType;
}
