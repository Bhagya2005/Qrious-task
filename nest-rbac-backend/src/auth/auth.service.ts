import {Injectable,UnauthorizedException,ConflictException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private buildPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
      role: user.role?.name?.toLowerCase(),

      permissions:
        user.role?.permissions
          ?.filter((p) => p.isActive === true) 
          .map((p) => ({
            name: p.name,
            isActive: p.isActive,
          })) || [],
    };
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = crypto.randomBytes(64).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.usersService.update(user.id, {
      refreshToken: hashedToken,
    });

    return refreshToken;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.usersService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    return {
      accessToken: this.jwtService.sign(
        this.buildPayload(user),
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          expiresIn: this.configService.getOrThrow<StringValue>(
            'JWT_ACCESS_EXPIRES_IN',
          ),
        },
      ),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

// async register(dto: RegisterDto) {
//     const existingUser = await this.usersService.findByEmail(dto.email);
//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const defaultRole = await this.usersService.getDefaultRole();

//     await this.usersService.create({
//       name: dto.name,
//       email: dto.email,
//       password: dto.password,
//       role: defaultRole,
//     });

//     return { message: 'User registered successfully' };
//   }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const defaultRole = await this.usersService.getDefaultRole();
    
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: defaultRole,
    });

    const tokens = await this.login(user as any); 

    return {
      message: 'User registered successfully',
      ...tokens,
    };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    if (hashedToken !== user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      this.buildPayload(user),
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<StringValue>(
          'JWT_ACCESS_EXPIRES_IN',
        ),
      },
    );

    return { accessToken: newAccessToken };
  }

 
}
