import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  import { Integer, Node } from 'neo4j-driver';
  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }
  
  export interface CreateUser extends CreateUserDto {}
  export type CreateUserType = Node<Integer, CreateUser>;
  export interface CreateUserInterface {
    u: CreateUserType;
  }
  