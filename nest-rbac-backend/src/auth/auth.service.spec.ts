import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Validate user for login */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.usersService.comparePassword(
      password,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /** Login -> return JWT */
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions?.map((p) => p.name) || [],
    };

    return { accessToken: this.jwtService.sign(payload) };
  }

  /** Register new user */
  async register(dto: { name: string; email: string; password: string }) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await this.usersService.hashPassword(dto.password);

    // Assign default role
    const defaultRole = await this.usersService.getDefaultRole();

    const newUser = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      roleId: defaultRole.id,
    });

    return this.login(newUser);
  }

  /** Refresh JWT */
  async refresh(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions?.map((p) => p.name) || [],
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
