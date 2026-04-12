/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    totalClass: { type: Number, required: true },
    totalAssignment: { type: Number, required: true },
    totalDuration: { type: String, required: true },
    totalMockTest: { type: Number, required: true },
    realPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    challengeDay: { type: Number, required: true },
    totalLecture: { type: Number, required: true },
    lectureData: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

courseSchema.index({ courseTitle: 1 });
courseSchema.index({ discountPrice: 1 });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
