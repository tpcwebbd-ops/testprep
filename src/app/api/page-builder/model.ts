import mongoose, { Schema } from 'mongoose';

const sectionContentSchema = new Schema({
  sectionUid: { type: String },
  title: { type: String },
  image: { type: String },
  heading: { type: String },
  description: { type: String },
  featuredLabel: { type: String },
  buttonPrimary: { type: String },
  buttonSecondary: { type: String },
  studentCount: { type: String },
  enrollmentText: { type: String },
  secondaryImage: { type: String },
  subtitle: { type: String },
  additionalDescription: { type: String },
  ctaText: { type: String },
  highlights: [{ type: String }],
});

const sectionSchema = new Schema(
  {
    title: { type: String },
    sectionUid: { type: String },
    content: { type: sectionContentSchema },
    isActive: { type: Boolean, default: true },
    picture: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Section || mongoose.model('Section', sectionSchema);
