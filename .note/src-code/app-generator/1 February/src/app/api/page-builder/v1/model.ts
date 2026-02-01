import mongoose, { Schema } from 'mongoose';

// Schema for individual content items (sections, forms, tags, etc.)
const pageContentSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['section', 'form', 'button', 'title', 'description', 'paragraph', 'sliders', 'tagSliders', 'logoSliders', 'gellery']
    },
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, timestamps: false }
);

// Main page builder schema
const pageBuilderSchema = new Schema(
  {
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: [pageContentSchema], default: [] },
  },
  { _id: true, timestamps: true }
);

// Add indexes for better query performance
pageBuilderSchema.index({ path: 1 });
pageBuilderSchema.index({ isActive: 1 });
pageBuilderSchema.index({ 'content.type': 1 });

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);
