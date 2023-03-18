import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class UserDetailsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc: string;

  @IsString()
  profileImg: string;

  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  technology: string[];
}

export interface UserDetails extends UserDetailsDto {}
export type UserDetailsType = Node<Integer, UserDetails>;
export interface UserDetailsInterface {
  u: UserDetailsType;
}
