import {Injectable,ConflictException,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

   
  findAll() {
    return this.permissionRepo.find({
      where: { isActive: true },
    });
  }

  async create(dto: CreatePermissionDto) {
    const name = `${dto.resource}:${dto.action}`;

    const existing = await this.permissionRepo.findOne({
      where: { name },
    });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        return this.permissionRepo.save(existing);
      }
      throw new ConflictException('Permission already exists');
    }

    const permission = this.permissionRepo.create({
      name,
      resource: dto.resource,
      action: dto.action,
      isActive: true,
    });

    return this.permissionRepo.save(permission);
  }

async remove(id: number) {
  const permission = await this.permissionRepo.findOne({
    where: { id, isActive: true },
  });

  if (!permission) {
    throw new NotFoundException('Permission not found');
  }

  permission.isActive = false;
  await this.permissionRepo.save(permission);

  return { message: 'Permission soft deleted successfully' };
}

}
