import {CanActivate,ExecutionContext,Injectable,ForbiddenException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/permissions/permission.entity';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { PERMISSIONS_KEY } from 'src/common/decorators/permission.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === 'admin') return true;

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredRoles.length && requiredRoles.includes(user.role)) {
      return true;
    }

    if (!requiredPermissions.length) return true;

    const activePermissions = await this.permissionRepo.find({
      where: { isActive: true },
    });

    const activePermissionNames = activePermissions.map(p => p.name);

    const userPermissions: string[] =
      user.permissions?.map((p) => p.name) || [];

    const hasPermission = requiredPermissions.every(
      (p) =>
        userPermissions.includes(p) &&
        activePermissionNames.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Permission revoked');
    }

    return true;
  }
}

