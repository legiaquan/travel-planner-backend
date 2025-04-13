import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum EDeviceType {
  WEB = 'web',
  MOBILE = 'mobile',
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: EDeviceType, default: EDeviceType.WEB })
  @IsEnum(EDeviceType)
  @IsNotEmpty()
  deviceType: EDeviceType = EDeviceType.WEB;
}
