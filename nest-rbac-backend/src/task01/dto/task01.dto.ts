import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class task01Dto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  salary: number;

  @IsArray()
  @Type(() => task01Dto)
  subordinates: task01Dto[];
  
}
