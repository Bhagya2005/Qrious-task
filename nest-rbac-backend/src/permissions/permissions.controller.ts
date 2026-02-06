import {Controller,Get,Post,Delete,Body,Param,UseGuards,ParseIntPipe} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccessGuard } from 'src/common/guards/access.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
@UseGuards(AuthGuard, AccessGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permission:read')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Post()
  @Permissions('permission:create')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Delete(':id')
  @Permissions('permission:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}
