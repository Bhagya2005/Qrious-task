import {Body,Controller,Delete,Get,Param,Patch,Post,UseGuards,ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Permissions } from '../common/decorators/permission.decorator';
import { AccessGuard } from 'src/common/guards/access.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, AccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @Permissions('user:read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @Permissions('user:read')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles('admin')
  @Permissions('user:create')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('user:delete')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }

  @Patch(':userId/assign-role/:roleId')
  @Roles('admin')
  @Permissions('user:role')
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.assignRole(userId, roleId);
  }
}



  //for learning purpose
  // @Patch(":id")
  // @Permissions("user:update")
  // update(
  //   @Param("id", ParseIntPipe) id: number, 
  //   @Body() dto: UpdateUserDto
  // ) {
  //   return this.usersService.update(id, dto);
  // }
