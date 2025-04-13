```typescript
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true },
  reviewId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
```
