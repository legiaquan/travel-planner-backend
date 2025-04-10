import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { ChangePasswordDto } from '../../../src/modules/auth/dto/change-password.dto';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from '../../../src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';
import { AuthResponse, UserResponse } from '../../../src/modules/auth/types/auth.types';
import { ESubscriptionTier, EUserRole, EUserStatus, IUser } from '../../../src/types';
describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn(),
    refreshToken: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthResponse: AuthResponse = {
      token: 'mockToken',
      refreshToken: 'mockRefreshToken',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      } as UserResponse,
    };

    it('should return auth response on successful login', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.signIn(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.signIn(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Test User',
      terms: true,
    };

    const mockAuthResponse: AuthResponse = {
      token: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      } as UserResponse,
    };

    it('should return auth response on successful registration', async () => {
      mockAuthService.signUp.mockResolvedValue(mockAuthResponse);

      const result = await controller.signUp(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.signUp).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockAuthService.signUp.mockRejectedValue(new BadRequestException());

      await expect(controller.signUp(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'mockRefreshToken',
    };

    const mockAuthResponse: AuthResponse = {
      token: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: EUserRole.USER,
        subscription: {
          plan: ESubscriptionTier.FREE,
          expiresAt: new Date().toISOString(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserResponse,
    };

    it('should return new auth response on successful token refresh', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
    });

    it('should throw UnauthorizedException on invalid refresh token', async () => {
      mockAuthService.refreshToken.mockRejectedValue(new UnauthorizedException());

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      userId: '1',
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    };

    const mockUser: IUser = {
      _id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword123',
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      emailVerified: true,
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        language: 'en',
        theme: 'light',
        currency: 'USD',
        notifications: {
          email: true,
          push: true,
          sms: true,
          activityReminders: true,
          tripUpdates: true,
          marketingMessages: true,
          communityUpdates: true,
        },
      },
      subscription: {
        tier: ESubscriptionTier.FREE,
        startDate: new Date(),
        endDate: new Date(),
        autoRenew: true,
      },
    };

    it('should successfully change password', async () => {
      mockAuthService.changePassword.mockResolvedValue(undefined);

      await controller.changePassword(changePasswordDto);

      expect(authService.changePassword).toHaveBeenCalledWith(changePasswordDto);
    });

    it('should throw UnauthorizedException on invalid current password', async () => {
      mockAuthService.changePassword.mockRejectedValue(new UnauthorizedException());

      await expect(controller.changePassword(changePasswordDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
