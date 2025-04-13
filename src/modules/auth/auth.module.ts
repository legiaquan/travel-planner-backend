import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenBlacklistModule } from '../token-blacklist/token-blacklist.module';
import { UserSessionModule } from '../user-session/user-session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { TokenBlacklistGuard } from './guards/token-blacklist.guard';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UserModule,
    TokenBlacklistModule,
    UserSessionModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'your-secret-key',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ] as (Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>)[],
  providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard, TokenBlacklistGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
