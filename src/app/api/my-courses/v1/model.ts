/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/
import mongoose, { Schema } from 'mongoose';

const myCourseSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
    enrollmentDate: { type: Date, default: Date.now },
    enrollCoursesID: [
      {
        courseID: { type: String },
        enrollmentDate: { type: Date, default: Date.now },
      },
    ],
    attenDance: [
      {
        courseID: { type: String },
        data: [
          {
            ClassName: { type: String },
            status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
            completeDate: { type: Date },
          },
        ],
      },
    ],
  },
  { _id: true, timestamps: true },
);

myCourseSchema.index({ studentEmail: 1 });
myCourseSchema.index({ studentName: 1 });

export default mongoose.models.MyCourse || mongoose.model('MyCourse', myCourseSchema);
