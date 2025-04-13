import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ActivityLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  address: string;

  @IsString()
  name: string;
}

export class ActivityChecklistDto {
  @IsString()
  id: string;

  @IsString()
  text: string;

  @IsBoolean()
  @IsOptional()
  checked?: boolean;
}

export type ActivityType =
  | 'accommodation'
  | 'transportation'
  | 'attraction'
  | 'food'
  | 'coffee'
  | 'other';

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  type: ActivityType;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ActivityLocationDto)
  locationDetails?: ActivityLocationDto;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  booked?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityChecklistDto)
  @IsOptional()
  checklist?: ActivityChecklistDto[];
}
