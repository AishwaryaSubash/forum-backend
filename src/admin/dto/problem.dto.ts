import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProblemDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}
