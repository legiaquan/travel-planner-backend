```typescript
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['accommodation', 'transportation', 'attraction', 'food', 'coffee', 'other'],
    default: 'other',
  },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String },
  locationDetails: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    name: { type: String },
  },
  notes: { type: String },
  cost: { type: Number },
  currency: { type: String, default: 'USD' },
  booked: { type: Boolean, default: false },
  checklist: [
    {
      id: { type: String, required: true },
      text: { type: String, required: true },
      checked: { type: Boolean, default: false },
    },
  ],
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
```
