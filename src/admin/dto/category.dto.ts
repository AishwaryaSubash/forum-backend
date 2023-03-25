import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCategDto {
  @IsString()
  @IsNotEmpty()
  categName: string;
}
