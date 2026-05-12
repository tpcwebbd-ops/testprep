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
    courseDescription: { type: String },
    isActive: { type: Boolean },
    totalClass: { type: Number },
    totalAssignment: { type: Number },
    totalDuration: { type: String },
    totalMockTest: { type: Number },
    realPrice: { type: Number },
    discountPrice: { type: Number },
    challengeDay: { type: Number },
    totalLecture: { type: Number },
    lectureData: { type: Schema.Types.Mixed, default: {} },
    level: { type: String },
    levelColorClass: { type: String },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    schedule: { type: [String], default: [] },
  },
  { _id: true, timestamps: true },
);

courseSchema.index({ courseTitle: 1 });
courseSchema.index({ discountPrice: 1 });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
