import { IUser } from '@/types';
import { comparePassword, hashPassword } from '@/utils/password.util';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  sub: string;
  email: string;
}

interface TokenResponse {
  token: string;
  refreshToken: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  subscription: {
    plan: string;
    expiresAt: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface JwtVerifyResponse {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<IUser, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('isPasswordValid: ', isPasswordValid);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user.toObject() as IUser;
    return result as Omit<IUser, 'password'>;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    console.log('user: ', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async signIn(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    console.log('isPasswordValid: ', isPasswordValid);

    const { token, refreshToken } = await this.generateTokens(user);
    return {
      token,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        subscription: {
          plan: user.subscription.tier,
          expiresAt: user.subscription.endDate?.toISOString() || null,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as UserResponse,
    };
  }

  async signUp(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      firstName: registerDto.name.split(' ')[0],
      lastName: registerDto.name.split(' ').slice(1).join(' '),
    });

    const { token, refreshToken } = await this.generateTokens(user);
    return {
      token,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        subscription: {
          plan: user.subscription.tier,
          expiresAt: user.subscription.endDate?.toISOString() || null,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as UserResponse,
    };
  }

  async signOut(userId: string): Promise<boolean> {
    // Clear refresh token
    await this.userService.update(userId, { refreshToken: null });

    return true;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    try {
      const payload = (await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
      )) as JwtVerifyResponse;
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.findOne(changePasswordDto.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await comparePassword(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const hashedPassword = await hashPassword(changePasswordDto.newPassword);
    await this.userService.updatePassword(user._id.toString(), hashedPassword);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  private async generateTokens(user: UserDocument): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { token, refreshToken };
  }
}
