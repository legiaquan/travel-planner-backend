import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateStatsDto {
  @ApiProperty({
    description: 'Field to update',
    example: 'tripsCreated',
    enum: [
      'tripsCreated',
      'tripsCompleted',
      'reviewsWritten',
      'reviewsLiked',
      'followers',
      'following',
    ],
  })
  @IsString()
  field: string;

  @ApiProperty({
    description: 'Value to increment by',
    example: 1,
  })
  @IsNumber()
  increment: number;
}
