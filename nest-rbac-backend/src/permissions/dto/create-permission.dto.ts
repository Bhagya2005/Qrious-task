import { IsEnum, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export enum PermissionResource {
  USER = 'user',
  ROLE = 'role',
  PERMISSION = 'permission',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

//learning : how to configure options 
@ValidatorConstraint({ name: 'RestrictedPermission', async: false })
class RestrictedPermissionValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as CreatePermissionDto;
    if (
      (obj.resource === PermissionResource.USER && obj.action === PermissionAction.UPDATE) ||
      (obj.resource === PermissionResource.PERMISSION && obj.action === PermissionAction.UPDATE) ||
      (obj.resource === PermissionResource.USER && obj.action === PermissionAction.MANAGE)||
      (obj.resource === PermissionResource.PERMISSION && obj.action === PermissionAction.MANAGE)
    ) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The combination of resource and action is not allowed.';
  }
}


export class CreatePermissionDto {
  @IsEnum(PermissionResource, {
    message: 'Resource must be one of user, role, permission',
  })
  resource: PermissionResource;

  @IsEnum(PermissionAction, {
    message: 'Action must be one of create, read, update, delete',
  })
  action: PermissionAction;

  @Validate(RestrictedPermissionValidator)
  check?: any;
}
