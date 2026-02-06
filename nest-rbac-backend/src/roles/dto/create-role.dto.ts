import {IsArray,IsNotEmpty,IsOptional,IsNumber} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the role',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'List of permission IDs to assign to the role',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}
