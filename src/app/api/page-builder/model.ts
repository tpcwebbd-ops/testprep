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

const pageBuilderSchema = new Schema(
  {
    title: { type: String, default: 'Main Page' },
    content: [
      {
        id: { type: String },
        title: { type: String },
        sectionUid: { type: String },
        serialNumber: { type: Number },
        content: { type: sectionContentSchema },
        isActive: { type: Boolean, default: false },
        picture: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);
