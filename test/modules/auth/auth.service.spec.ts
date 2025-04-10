import { UserService } from '@/modules/user/user.service';
import { comparePassword, hashPassword } from '@/utils/password.util';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { ChangePasswordDto } from '../../../src/modules/auth/dto/change-password.dto';
import { LoginDto } from '../../../src/modules/auth/dto/login.dto';
import { RefreshTokenDto } from '../../../src/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from '../../../src/modules/auth/dto/register.dto';
import { ESubscriptionTier, EUserRole, EUserStatus, IUser } from '../../../src/types';

jest.mock('@/utils/password.util', () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser: IUser = {
      _id: '1',
      email: 'test@example.com',
      password: '$2a$10$X7z3Q9Z8Y4W2V1U0T9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B1A0',
      name: 'Test User',
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      emailVerified: true,
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
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
    } as IUser;

    it('should return auth response on successful login', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mockToken');

      const result = await service.signIn(loginDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(loginDto)).rejects.toThrow(UnauthorizedException);
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

    const mockUser: IUser = {
      _id: '1',
      email: 'test@example.com',
      password: '$2a$10$X7z3Q9Z8Y4W2V1U0T9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B1A0',
      name: 'Test User',
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      emailVerified: true,
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
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
    } as IUser;

    it('should return auth response on successful registration', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mockToken');

      const result = await service.signUp(registerDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signUp(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'mockRefreshToken',
    };

    const mockUser: IUser = {
      _id: '1',
      email: 'test@example.com',
      password: '$2a$10$X7z3Q9Z8Y4W2V1U0T9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B1A0',
      name: 'Test User',
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      emailVerified: true,
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
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
    } as IUser;

    it('should return new auth response on successful token refresh', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: mockUser._id,
        email: mockUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('newToken');

      const result = await service.refreshToken(refreshTokenDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser._id);
    });

    it('should throw UnauthorizedException on invalid refresh token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
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
      password: '$2a$10$X7z3Q9Z8Y4W2V1U0T9S8R7Q6P5O4N3M2L1K0J9I8H7G6F5E4D3C2B1A0',
      name: 'Test User',
      role: EUserRole.USER,
      status: EUserStatus.ACTIVE,
      emailVerified: true,
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
      stats: {
        tripsCreated: 0,
        tripsCompleted: 0,
        reviewsWritten: 0,
        reviewsLiked: 0,
        followers: 0,
        following: 0,
      },
    } as IUser;

    it('should successfully change password', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (hashPassword as jest.Mock).mockResolvedValue('hashedNewPassword');
      mockUsersService.updatePassword.mockResolvedValue(true);

      const result = await service.changePassword(changePasswordDto);

      expect(result).toEqual({
        success: true,
        message: 'Password updated successfully',
      });
      expect(mockUsersService.findOne).toHaveBeenCalledWith(changePasswordDto.userId);
      expect(comparePassword).toHaveBeenCalledWith(
        changePasswordDto.currentPassword,
        mockUser.password,
      );
      expect(hashPassword).toHaveBeenCalledWith(changePasswordDto.newPassword);
      expect(mockUsersService.updatePassword).toHaveBeenCalledWith(
        mockUser._id.toString(),
        'hashedNewPassword',
      );
    });

    it('should throw BadRequestException on invalid current password', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(changePasswordDto)).rejects.toThrow(BadRequestException);
    });
  });
});
