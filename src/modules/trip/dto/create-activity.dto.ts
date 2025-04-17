import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Latitude of the activity location' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude of the activity location' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Full address of the activity location' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Name of the activity location' })
  @IsString()
  name: string;
}

export class ActivityChecklistDto {
  @ApiProperty({ description: 'Unique identifier for the checklist item' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Text content of the checklist item' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Whether the checklist item is checked', required: false })
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
  @ApiProperty({ description: 'Title of the activity' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Type of the activity',
    enum: ['accommodation', 'transportation', 'attraction', 'food', 'coffee', 'other'],
  })
  @IsString()
  type: ActivityType;

  @ApiProperty({ description: 'Start time of the activity', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ description: 'End time of the activity', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ description: 'Location name of the activity', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Detailed location information',
    required: false,
    type: () => ActivityLocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ActivityLocationDto)
  locationDetails?: ActivityLocationDto;

  @ApiProperty({ description: 'Additional notes for the activity', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Cost of the activity', required: false })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ description: 'Currency for the activity cost', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Whether the activity is booked', required: false })
  @IsBoolean()
  @IsOptional()
  booked?: boolean;

  @ApiProperty({
    description: 'List of checklist items for the activity',
    required: false,
    type: [ActivityChecklistDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityChecklistDto)
  @IsOptional()
  checklist?: ActivityChecklistDto[];
}
