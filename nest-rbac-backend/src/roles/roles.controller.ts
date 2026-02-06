import {Controller,Get,Post,Patch,Delete,Param,Body,ParseIntPipe,UseGuards} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccessGuard } from 'src/common/guards/access.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { Permissions } from 'src/common/decorators/permission.decorator';
// import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('roles')
@UseGuards(AuthGuard, AccessGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('role:read')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('role:read')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findById(id);
  }

  @Post()
  @Permissions('role:create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id/permissions')
  @Permissions('role:manage')
  assignPermission(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() dto: AssignPermissionDto,
  ) {
    return this.rolesService.assignPermission(roleId, dto.permissionId);
  }

  @Delete(':id/permissions/:permissionId')
  @Permissions('role:manage')
  removePermission(
    @Param('id', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolesService.removePermission(roleId, permissionId);
  }

  @Delete(':id')
  @Permissions('role:delete')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.delete(id);
  }
}
