import { Injectable, NotFoundException, ConflictException,BadRequestException ,InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permRepo: Repository<Permission>,
    @InjectRepository(User) private readonly userRepo : Repository<User>
  ) {}

async findAll() {
  return await this.roleRepo.find({
    where: { isActive: true },  // Sirf active roles fetch honge
    relations: ['permissions'], // Permissions table join hogi (Count fix ho jayega)
  });
}
 async findById(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id, isActive: true },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    role.permissions = role.permissions.filter((p) => p.isActive);
    return role;
  }

  async create(dto: CreateRoleDto) {
    const { name, permissionIds } = dto;

    const existing = await this.roleRepo.findOne({ where: { name } });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        return this.roleRepo.save(existing);
      }
      throw new ConflictException('Role already exists');
    }

    const role = this.roleRepo.create({ name, isActive: true });

    if (permissionIds?.length) {
      const permissions = await this.permRepo.find({
        where: { id: In(permissionIds), isActive: true },
      });

      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('Some permissions not found');
      }

      role.permissions = permissions;
    }

    return this.roleRepo.save(role);
  }

  async assignPermission(roleId: number, permissionId: number) {
    const role = await this.findById(roleId);

    const permission = await this.permRepo.findOne({
      where: { id: permissionId, isActive: true },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    if (!role.permissions.some((p) => p.id === permission.id)) {
      role.permissions.push(permission);
      await this.roleRepo.save(role);
    }
    
   
    return this.getPermissionsByRole(roleId);
  }

  async removePermission(roleId: number, permissionId: number) {
    const role = await this.findById(roleId);

    role.permissions = role.permissions.filter((p) => p.id !== permissionId);
    await this.roleRepo.save(role);

    return this.getPermissionsByRole(roleId);
  }

  async getPermissionsByRole(roleId: number) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId, isActive: true },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role.permissions.filter((p) => p.isActive);
  }        

//   async delete(id: number) {
//     const role = await this.roleRepo.findOne({
//       where: { id, isActive: true },
//       relations: ['users'],
//     });

//     if (!role) throw new NotFoundException('Role not found');

//     if (role.users.length) {
//       throw new ConflictException('Role is assigned to users');
//     }

//     role.isActive = false;
//     await this.roleRepo.save(role);

//     return { message: 'Role soft deleted successfully' };
//   }
// }

async delete(id: number) {
  const role = await this.roleRepo.findOne({
    where: { id, isActive: true },
    relations: ['users'],
  });

  if (!role) throw new NotFoundException('Role not found');

  const protectedNames = ['ADMIN', 'USER', 'NORMAL USER', 'SUPERADMIN'];
  if (protectedNames.includes(role.name.toUpperCase())) {
    throw new BadRequestException('System roles cannot be deleted');
  }


  let defaultRole = await this.roleRepo.findOne({
    where: [
      { name: 'USER' },
      { name: 'Normal User' },
      { id: 2 } 
    ]
  });

  if (role.users.length > 0) {
    if (!defaultRole) {
      defaultRole = await this.roleRepo.createQueryBuilder("role")
        .where("role.name != :name", { name: 'ADMIN' })
        .andWhere("role.isActive = :active", { active: true })
        .getOne();
    }

    if (defaultRole) {
      await this.userRepo.update(
        { role: { id: id } }, 
        { role: { id: defaultRole.id } }
      );
    }
  }

  role.isActive = false;
  await this.roleRepo.save(role);

  return { message: `Users moved to ${defaultRole?.name || 'Default Role'}` };
}
}