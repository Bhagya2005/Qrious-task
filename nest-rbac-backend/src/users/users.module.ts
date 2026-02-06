import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Role } from '../roles/role.entity';
import { PermissionsModule } from '../permissions/permissions.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PermissionsModule, 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
