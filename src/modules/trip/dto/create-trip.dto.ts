import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TripLocationDto {
  @ApiProperty({ description: 'Latitude of the location' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude of the location' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Full address of the location' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Name of the location' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Country of the location' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'City of the location' })
  @IsString()
  city: string;
}

export class CreateTripDto {
  @ApiProperty({ description: 'Title of the trip' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Destination of the trip' })
  @IsString()
  destination: string;

  @ApiProperty({ description: 'Whether the trip has specific dates' })
  @IsBoolean()
  hasDates: boolean;

  @ApiProperty({ description: 'Duration of the trip in days' })
  @IsNumber()
  durationDays: number;

  @ApiProperty({ description: 'Start date of the trip', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date of the trip', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: 'Description of the trip', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Cover image URL for the trip', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: 'Budget for the trip', required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ description: 'Country code of the destination', required: false })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({ description: 'City ID of the destination', required: false })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiProperty({
    description: 'Detailed location information',
    required: false,
    type: () => TripLocationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TripLocationDto)
  locationDetails?: TripLocationDto;
}
