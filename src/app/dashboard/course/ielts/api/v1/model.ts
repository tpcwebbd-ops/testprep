/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    pdf: { type: String },
    wordFile: { type: String },
    videoLink: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);

export interface ICourses {
  name: string;
  pdf: string;
  wordFile: string;
  videoLink: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
