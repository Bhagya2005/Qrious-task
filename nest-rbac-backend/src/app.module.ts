import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { User } from './users/users.entity';
import { Role } from './roles/role.entity';
import { Permission } from './permissions/permission.entity';
import { Task01Module } from './task01/task01.module';
import { Task02Module } from './task02/task02.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

  
   TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Role, Permission],
  synchronize: true, 
}),
 
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    Task01Module,
    Task02Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

