import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EActivityType, EActivityStatus } from '../types/activity.type';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ required: true, ref: 'Plan' })
  planId: string;

  @Prop({ type: String, enum: EActivityType, required: true })
  type: EActivityType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({
    required: true,
    type: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
  })
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  @Prop({ type: String, enum: EActivityStatus, default: EActivityStatus.PLANNED })
  status: EActivityStatus;

  @Prop({ default: 0 })
  cost: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
