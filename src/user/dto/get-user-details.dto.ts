import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class GetUserDetailsDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export interface GetUserDetails extends GetUserDetailsDto {
  email: string;
  profileImg: string;
  desc: string;
  technology: string[];
}
export type GetUserDetailsType = Node<Integer, GetUserDetails>;
export interface GetUserDetailsInterface {
  u: GetUserDetailsType;
}
