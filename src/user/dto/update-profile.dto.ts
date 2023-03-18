import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  profileImg: string;
}

export interface UpdateProfile extends UpdateProfileDto {}
export type UpdateProfileType = Node<Integer, UpdateProfile>;
export interface UpdateProfileInterface {
  u: UpdateProfileType;
}
