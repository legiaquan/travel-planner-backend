import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorResponse, SuccessResponse } from '../../common/responses';
import { HealthResponseDto, PingResponseDto } from './dto/health.response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    type: HealthResponseDto,
  })
  @ApiResponse({ status: 503, description: 'Application is unhealthy' })
  async checkHealth() {
    try {
      const data = await this.healthService.checkHealth();
      return new SuccessResponse({
        data,
        message: 'Health check completed successfully',
      });
    } catch (error) {
      return new ErrorResponse({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Pong response',
    type: PingResponseDto,
  })
  ping() {
    const data = this.healthService.ping();

    throw new BadRequestException('User not found', {});

    return new SuccessResponse({
      data,
      message: 'pong',
    });
  }
}
