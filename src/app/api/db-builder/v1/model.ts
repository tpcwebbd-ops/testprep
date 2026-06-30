/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const pageContentSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['field'],
    },
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, timestamps: false },
);

const dbBuilderSchema = new Schema(
  {
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: [pageContentSchema], default: [] },
  },
  { _id: true, timestamps: true },
);

dbBuilderSchema.index({ path: 1 });
dbBuilderSchema.index({ isActive: 1 });
dbBuilderSchema.index({ 'content.type': 1 });

const dbBuilderRecordSchema = new Schema(
  {
    pageId: { type: Schema.Types.ObjectId, ref: 'DbBuilder', required: true, index: true },
    values: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

dbBuilderRecordSchema.index({ pageId: 1, createdAt: -1 });

export const DbBuilderRecord = mongoose.models.DbBuilderRecord || mongoose.model('DbBuilderRecord', dbBuilderRecordSchema);

export default mongoose.models.DbBuilder || mongoose.model('DbBuilder', dbBuilderSchema);
