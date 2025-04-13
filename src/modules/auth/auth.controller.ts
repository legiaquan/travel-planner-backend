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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto, EDeviceType, LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse, SignUpDto, TokenResponse } from './types/auth.types';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginDto,
    examples: {
      web: {
        value: {
          email: 'john.doe@example.com',
          password: 'Password123!',
          deviceType: EDeviceType.WEB,
        },
      },
      mobile: {
        value: {
          email: 'john.doe@example.com',
          password: 'Password123!',
          deviceType: EDeviceType.MOBILE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns access token and user information',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: SuccessResponse,
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthResponse> {
    const deviceInfo = extractDeviceInfo(req);
    return this.authService.login(loginDto, deviceInfo);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          terms: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: CreatedResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists or invalid data',
    type: SuccessResponse,
  })
  async register(@Body() registerDto: RegisterDto): Promise<SuccessResponse<SignUpDto>> {
    const result = await this.authService.signUp(registerDto);
    return new CreatedResponse({
      message: 'Successfully registered',
      data: {
        user: result.user,
      },
    });
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'User logout' })
  @ApiSecurity('bearer')
  @ApiResponse({
    status: 200,
    description: 'Successfully signed out',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: SuccessResponse,
  })
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

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      default: {
        value: {
          refreshToken: 'rt_1a2b3c4d5e6f7g8h9i0j',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token and refresh token',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: SuccessResponse,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiSecurity('bearer')
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      default: {
        value: {
          userId: '507f1f77bcf86cd799439011',
          currentPassword: 'CurrentPassword123!',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Current password is incorrect',
    type: SuccessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: SuccessResponse,
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.changePassword(changePasswordDto);
  }
}
