/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/
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
    courseId: { type: String, required: true },
    progress: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
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
myCourseSchema.index({ courseId: 1 });

export default mongoose.models.MyCourse || mongoose.model('MyCourse', myCourseSchema);
