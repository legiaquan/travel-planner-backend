import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IUser } from '../../models/user.model';
import { EUserRole, ICreateUser, IResetPassword, IUpdateUser } from '../../types/user.type';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TokenBlacklistGuard } from '../auth/guards/token-blacklist.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, TokenBlacklistGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(EUserRole.ADMIN)
  create(@Body() createUserDto: ICreateUser) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(EUserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  getProfile(@Request() req: { user: { id: string } }) {
    return this.userService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: IUpdateUser) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: IResetPassword) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('verify-email/:token')
  verifyEmail(@Param('token') token: string) {
    return this.userService.verifyEmail(token);
  }

  @Patch('preferences')
  updatePreferences(
    @Request() req: { user: { id: string } },
    @Body() preferences: Partial<IUser['preferences']>,
  ) {
    return this.userService.updatePreferences(req.user.id, preferences);
  }

  @Patch('subscription')
  updateSubscription(
    @Request() req: { user: { id: string } },
    @Body() subscription: Partial<IUser['subscription']>,
  ) {
    return this.userService.updateSubscription(req.user.id, subscription);
  }

  @Post('social/link')
  linkSocialProfile(
    @Request() req: { user: { id: string } },
    @Body() data: { provider: keyof IUser['socialProfiles']; profileId: string },
  ) {
    return this.userService.linkSocialProfile(req.user.id, data.provider, data.profileId);
  }

  @Post('social/unlink/:provider')
  unlinkSocialProfile(
    @Request() req: { user: { id: string } },
    @Param('provider') provider: keyof IUser['socialProfiles'],
  ) {
    return this.userService.unlinkSocialProfile(req.user.id, provider);
  }

  @Patch('stats/:field')
  @Roles(EUserRole.ADMIN)
  updateStats(
    @Param('field') field: keyof IUser['stats'],
    @Body() data: { userId: string; increment: number },
  ) {
    return this.userService.updateStats(data.userId, field, data.increment);
  }
}
