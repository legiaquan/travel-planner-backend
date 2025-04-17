import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripService } from './trip.service';

@ApiTags('trips')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripController {
  constructor(private readonly TripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip has been successfully created.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreatedResponse',
        },
        example: {
          status: 'Created',
          statusCode: 201,
          message: 'Created',
          timestamp: '2024-04-15T10:00:00.000Z',
          data: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Summer Vacation 2024',
            destination: 'Bali, Indonesia',
            hasDates: true,
            durationDays: 7,
            startDate: '2024-07-01',
            endDate: '2024-07-07',
            description: 'A week-long vacation in Bali',
            coverImage: 'https://example.com/bali-cover.jpg',
            budget: 2000,
            countryCode: 'ID',
            cityId: 'bali',
            locationDetails: {
              lat: -8.3405,
              lng: 115.092,
              address: 'Kuta, Bali, Indonesia',
              name: 'Kuta Beach',
              country: 'Indonesia',
              city: 'Kuta',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: CreateTripDto })
  async createTrip(
    @CurrentUser('id') userId: Types.ObjectId,
    @Body() createTripDto: CreateTripDto,
  ) {
    return this.TripService.createTrip(userId, createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({
    status: 200,
    description: 'Return all trips.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/PaginatedResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'Success',
          timestamp: '2024-04-15T10:00:00.000Z',
          data: [
            {
              _id: '507f1f77bcf86cd799439011',
              title: 'Summer Vacation 2024',
              destination: 'Bali, Indonesia',
              hasDates: true,
              durationDays: 7,
              startDate: '2024-07-01',
              endDate: '2024-07-07',
              description: 'A week-long vacation in Bali',
              coverImage: 'https://example.com/bali-cover.jpg',
              budget: 2000,
              countryCode: 'ID',
              cityId: 'bali',
              locationDetails: {
                lat: -8.3405,
                lng: 115.092,
                address: 'Kuta, Bali, Indonesia',
                name: 'Kuta Beach',
                country: 'Indonesia',
                city: 'Kuta',
              },
            },
          ],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  async getTrips(
    @CurrentUser('id') userId: Types.ObjectId,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ) {
    return this.TripService.getTrips(userId, { page, limit, status, sort });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the trip.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'OK',
          timestamp: '2024-04-15T10:00:00.000Z',
          data: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Summer Vacation 2024',
            destination: 'Bali, Indonesia',
            hasDates: true,
            durationDays: 7,
            startDate: '2024-07-01',
            endDate: '2024-07-07',
            description: 'A week-long vacation in Bali',
            coverImage: 'https://example.com/bali-cover.jpg',
            budget: 2000,
            countryCode: 'ID',
            cityId: 'bali',
            locationDetails: {
              lat: -8.3405,
              lng: 115.092,
              address: 'Kuta, Bali, Indonesia',
              name: 'Kuta Beach',
              country: 'Indonesia',
              city: 'Kuta',
            },
            activities: [
              {
                _id: '507f1f77bcf86cd799439012',
                title: 'Visit Ubud Monkey Forest',
                type: 'attraction',
                startTime: '2024-07-02T09:00:00.000Z',
                endTime: '2024-07-02T12:00:00.000Z',
                location: 'Ubud Monkey Forest',
                locationDetails: {
                  lat: -8.5184,
                  lng: 115.2589,
                  address: 'Jalan Monkey Forest, Ubud, Bali',
                  name: 'Sacred Monkey Forest Sanctuary',
                },
                notes: 'Bring camera and water',
                cost: 20,
                currency: 'USD',
                booked: true,
                checklist: [
                  {
                    id: '1',
                    text: 'Buy tickets online',
                    checked: true,
                  },
                  {
                    id: '2',
                    text: 'Pack camera',
                    checked: false,
                  },
                ],
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', type: String })
  async getTripById(@CurrentUser('id') userId: Types.ObjectId, @Param('id') tripId: string) {
    return this.TripService.getTripById(userId, tripId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({
    status: 200,
    description: 'Trip has been successfully updated.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'OK',
          timestamp: '2024-04-15T11:00:00.000Z',
          data: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Summer Vacation 2024 - Updated',
            destination: 'Bali, Indonesia',
            hasDates: true,
            durationDays: 7,
            startDate: '2024-07-01',
            endDate: '2024-07-07',
            description: 'A week-long vacation in Bali with updated plans',
            coverImage: 'https://example.com/bali-cover.jpg',
            budget: 2500,
            countryCode: 'ID',
            cityId: 'bali',
            locationDetails: {
              lat: -8.3405,
              lng: 115.092,
              address: 'Kuta, Bali, Indonesia',
              name: 'Kuta Beach',
              country: 'Indonesia',
              city: 'Kuta',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', type: String })
  async updateTrip(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('id') tripId: string,
    @Body() updateData: any,
  ) {
    return this.TripService.updateTrip(userId, tripId, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiResponse({
    status: 200,
    description: 'Trip has been successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'OK',
          timestamp: '2024-04-15T11:00:00.000Z',
          data: {
            message: 'Trip deleted successfully',
            deletedTrip: {
              _id: '507f1f77bcf86cd799439011',
              title: 'Summer Vacation 2024',
              destination: 'Bali, Indonesia',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'id', type: String })
  async deleteTrip(@CurrentUser('id') userId: Types.ObjectId, @Param('id') tripId: string) {
    return this.TripService.deleteTrip(userId, tripId);
  }

  @Post(':tripId/activities')
  @ApiOperation({ summary: 'Add an activity to a trip' })
  @ApiResponse({
    status: 201,
    description: 'Activity has been successfully added.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreatedResponse',
        },
        example: {
          status: 'Created',
          statusCode: 201,
          message: 'Created',
          timestamp: '2024-04-15T10:00:00.000Z',
          data: {
            _id: '507f1f77bcf86cd799439012',
            title: 'Visit Ubud Monkey Forest',
            type: 'attraction',
            startTime: '2024-07-02T09:00:00.000Z',
            endTime: '2024-07-02T12:00:00.000Z',
            location: 'Ubud Monkey Forest',
            locationDetails: {
              lat: -8.5184,
              lng: 115.2589,
              address: 'Jalan Monkey Forest, Ubud, Bali',
              name: 'Sacred Monkey Forest Sanctuary',
            },
            notes: 'Bring camera and water',
            cost: 20,
            currency: 'USD',
            booked: true,
            checklist: [
              {
                id: '1',
                text: 'Buy tickets online',
                checked: true,
              },
              {
                id: '2',
                text: 'Pack camera',
                checked: false,
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'tripId', type: String })
  @ApiBody({ type: CreateActivityDto })
  async addActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.TripService.addActivity(userId, tripId, createActivityDto);
  }

  @Put(':tripId/activities/:activityId')
  @ApiOperation({ summary: 'Update an activity in a trip' })
  @ApiResponse({
    status: 200,
    description: 'Activity has been successfully updated.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'OK',
          timestamp: '2024-04-15T11:00:00.000Z',
          data: {
            _id: '507f1f77bcf86cd799439012',
            title: 'Visit Ubud Monkey Forest - Updated',
            type: 'attraction',
            startTime: '2024-07-02T10:00:00.000Z',
            endTime: '2024-07-02T13:00:00.000Z',
            location: 'Ubud Monkey Forest',
            locationDetails: {
              lat: -8.5184,
              lng: 115.2589,
              address: 'Jalan Monkey Forest, Ubud, Bali',
              name: 'Sacred Monkey Forest Sanctuary',
            },
            notes: 'Bring camera, water, and snacks',
            cost: 25,
            currency: 'USD',
            booked: true,
            checklist: [
              {
                id: '1',
                text: 'Buy tickets online',
                checked: true,
              },
              {
                id: '2',
                text: 'Pack camera',
                checked: true,
              },
              {
                id: '3',
                text: 'Pack snacks',
                checked: false,
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip or activity not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'tripId', type: String })
  @ApiParam({ name: 'activityId', type: String })
  async updateActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Param('activityId') activityId: string,
    @Body() updateData: any,
  ) {
    return this.TripService.updateActivity(userId, tripId, activityId, updateData);
  }

  @Delete(':tripId/activities/:activityId')
  @ApiOperation({ summary: 'Delete an activity from a trip' })
  @ApiResponse({
    status: 200,
    description: 'Activity has been successfully deleted.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse',
        },
        example: {
          status: 'success',
          statusCode: 200,
          message: 'OK',
          timestamp: '2024-04-15T11:00:00.000Z',
          data: {
            message: 'Activity deleted successfully',
            deletedActivity: {
              _id: '507f1f77bcf86cd799439012',
              title: 'Visit Ubud Monkey Forest',
              type: 'attraction',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Trip or activity not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'tripId', type: String })
  @ApiParam({ name: 'activityId', type: String })
  async deleteActivity(
    @CurrentUser('id') userId: Types.ObjectId,
    @Param('tripId') tripId: string,
    @Param('activityId') activityId: string,
  ) {
    return this.TripService.deleteActivity(userId, tripId, activityId);
  }
}
