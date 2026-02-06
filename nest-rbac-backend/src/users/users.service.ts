import {Injectable,NotFoundException,ForbiddenException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from '../roles/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtil } from '../common/utils/password.util';
import { Permission } from '../permissions/permission.entity';
import { Permissions } from '../common/decorators/permission.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email, isActive: true },
      relations: ['role', 'role.permissions'],
    });
  }

  async findAll(): Promise<User[]> {
    const role = await this.userRepo.find({
      where: { isActive: true },
      relations: ['role', 'role.permissions'],
    });
    if(!role){
      throw new NotFoundException('No active users found');
    }
    role.forEach(user => {
      user.role.permissions = user.role.permissions.filter(p => p.isActive);
    });
    // const role = await this.userRepo.find({
    //   relations: ['role', 'role.permissions'],
    // });
    return role;
      
  }
  async findById(id: number): Promise<User | null> {
    const role = await this.userRepo.findOne({
      where: { id, isActive: true },
      relations: ['role', 'role.permissions'],
    });
    if(!role){
      throw new NotFoundException('user not found');
    }
    role.role.permissions = role.role.permissions.filter(p => p.isActive);
    return role;
  } 

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return PasswordUtil.compare(plain, hash);
  }

  async getDefaultRole(): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { name: 'User', isActive: true },
      relations: ['permissions'],
    });

    if (!role) throw new Error('Default role not found');
    return role;
  }

  async create(
    userData: Partial<User>,
  ): Promise<Omit<User, 'password' | 'role' | 'refreshToken'>> {
    if (userData.password) {
      userData.password = await PasswordUtil.hash(userData.password);
    }

    if (!userData.role) {
      userData.role = await this.getDefaultRole();
    }

    const user = this.userRepo.create({
      ...userData,
      isActive: true,
    });

    const savedUser = await this.userRepo.save(user);

    const fullUser = await this.userRepo.findOne({
      where: { id: savedUser.id },
      relations: ['role', 'role.permissions'],
    });

    if (!fullUser) throw new Error('User creation failed');

    const { password, role, refreshToken, ...safeUser } = fullUser;
    return safeUser;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id, isActive: true },
    });

    if (!user) throw new NotFoundException('User not found');

    if (updateData.password) {
      updateData.password = await PasswordUtil.hash(updateData.password);
    }

    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  // async findAll(): Promise<User[]> {
  //   const role = await this.userRepo.find({
  //     where: { isActive: true },
  //     relations: ['role', 'role.permissions'],
  //   });
  //   if(!role){
  //     throw new NotFoundException('No active users found');
  //   }
  //   role.forEach(user => {
  //     user.role.permissions = user.role.permissions.filter(p => p.isActive);
  //   });
  //   return role;
      
  // }

  async delete(id: number) {
    const user = await this.userRepo.findOne({
      where: { id, isActive: true },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.email === 'admin@example.com') {
      throw new ForbiddenException("You can't delete admin");
    }

    user.isActive = false;
    await this.userRepo.save(user);

    return { message: 'User soft deleted successfully' };
  }

  async assignRole(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isActive: true },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepo.findOne({
      where: { id: roleId, isActive: true },
    });
    if (!role) throw new NotFoundException('Role not found');

    user.role = role;
    user.roleId = role.id;

    return this.userRepo.save(user);
  }
}
