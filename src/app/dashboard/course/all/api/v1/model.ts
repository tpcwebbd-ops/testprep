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
    books: [{ type: String }],
    topics: [{ type: String }],
    enrolledStudents: [{ type: String }],
    runningStudents: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);

export interface ICourses {
  name: string;
  books: string[];
  topics: string[];
  enrolledStudents: string[];
  runningStudents: string[];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
