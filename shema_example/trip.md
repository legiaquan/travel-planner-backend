```typescript
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true, unique: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  hasDates: { type: Boolean, default: false },
  durationDays: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  description: { type: String },
  coverImage: { type: String },
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'active', 'completed'],
    default: 'planning',
  },
  budget: { type: Number },
  activities: [Activity],
  countryCode: { type: String },
  cityId: { type: String },
  locationDetails: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    name: { type: String },
    country: { type: String },
    city: { type: String },
  },
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
```
