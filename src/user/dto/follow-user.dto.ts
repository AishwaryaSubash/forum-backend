import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node, Relationship } from 'neo4j-driver';

export class FollowUserDto {
  @IsString()
  @IsNotEmpty()
  follower: string;

  @IsString()
  @IsNotEmpty()
  leader: string;
}

export interface FollowUser {
  name: string;
  email: string;
  desc: string;
  profileImg: string;
  technology: string[];
}
export type FollowUserType = Node<Integer, FollowUser>;
type FollowsRelation = Relationship<Integer, {}>;
export interface FollowUserInterface {
  u: FollowUserType;
  r: FollowsRelation;
  p: FollowUserType;
}
