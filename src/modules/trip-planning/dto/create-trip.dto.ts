import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TripLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsString()
  city: string;
}

export class CreateTripDto {
  @IsString()
  title: string;

  @IsString()
  destination: string;

  @IsBoolean()
  hasDates: boolean;

  @IsNumber()
  durationDays: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TripLocationDto)
  locationDetails?: TripLocationDto;
}
