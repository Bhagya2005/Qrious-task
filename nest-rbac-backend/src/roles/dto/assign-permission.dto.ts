import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    description: 'ID of the permission to assign',
    example: 3,
  })
  @IsNumber()
  permissionId: number;
}
