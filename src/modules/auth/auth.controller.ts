import { CreatedResponse, SuccessResponse } from '@/common/responses';
import { RequestWithUser } from '@/common/types/request-with-user.type';
import { extractDeviceInfo } from '@/common/utils/device-info.util';
import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EDeviceType, LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse, SignUpDto, TokenResponse } from './types/auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns access token and user information',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            subscription: {
              type: 'object',
              properties: {
                plan: { type: 'string' },
                expiresAt: { type: 'string', nullable: true },
              },
            },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  @Post('sign-in')
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthResponse> {
    const deviceInfo = extractDeviceInfo(req);
    return this.authService.login(loginDto, deviceInfo);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Returns access token and user information',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string', nullable: true },
            role: { type: 'string' },
            subscription: {
              type: 'object',
              properties: {
                plan: { type: 'string' },
                expiresAt: { type: 'string', nullable: true },
              },
            },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  @Post('sign-up')
  async register(@Body() registerDto: RegisterDto): Promise<SuccessResponse<SignUpDto>> {
    console.log('registerDto: ', registerDto);
    const result = await this.authService.signUp(registerDto);
    return new CreatedResponse({
      message: 'Successfully registered',
      data: {
        user: result.user,
      },
    });
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'Successfully signed out',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('sign-out')
  async logout(@Req() req: RequestWithUser): Promise<SuccessResponse<undefined>> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    await this.authService.signOut(req.user._id.toString(), token, EDeviceType.WEB);

    return new SuccessResponse({
      message: 'Successfully signed out',
    });
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token and refresh token',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Current password is incorrect',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        code: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.changePassword(changePasswordDto);
  }
}
