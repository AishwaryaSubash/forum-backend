import { IsNotEmpty, IsString } from 'class-validator';

export class AllProbInCategDto {
  @IsString()
  @IsNotEmpty()
  categName: string;
}
