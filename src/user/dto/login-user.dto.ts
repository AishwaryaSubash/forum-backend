import { IsNotEmpty, IsString } from 'class-validator';
import { Integer, Node } from 'neo4j-driver';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface LoginUser extends LoginUserDto {}
export type LoginUserType = Node<Integer, LoginUser>;
export interface LoginUserInterface {
  u: LoginUserType;
}
