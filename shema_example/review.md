```typescript
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
  },
  trip: {
    destination: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    durationDays: { type: Number },
  },
  location: { type: String },
  rating: { type: Number },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [
    {
      id: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        avatar: { type: String },
      },
      likes: { type: Number, default: 0 },
    },
  ],
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
```
