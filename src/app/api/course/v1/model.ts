import mongoose, { Schema } from 'mongoose';

// Main course builder schema
const courseBuilderSchema = new Schema(
  {
    courseName: { type: String, required: true },
    courseDay: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.CourseBuilder || mongoose.model('CourseBuilder', courseBuilderSchema);
