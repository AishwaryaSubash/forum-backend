import { IsNotEmpty, IsString } from "class-validator";

export class FullTextDto {

    @IsString()
    @IsNotEmpty()
    text:string
}