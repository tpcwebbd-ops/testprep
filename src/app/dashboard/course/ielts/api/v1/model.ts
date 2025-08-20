/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const IELTScourseSchema = new Schema(
  {
    lectureTitle: { type: String },
    lectureNo: { type: Number },
    pdf: { type: String },
    wordFile: { type: String },
    videoLink: { type: String },
    shortDescription: { type: String },
    summery: { type: String },
    details: { type: String },
    note: { type: String },
    classDuration: { type: String },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true },
);

export default mongoose.models.IELTScourse || mongoose.model('IELTScourse', IELTScourseSchema);

export interface IELTScourse {
  lectureTitle: string;
  lectureNo: number;
  pdf: string;
  wordFile: string;
  videoLink: string;
  shortDescription: string;
  summery: string;
  details: string;
  note: string;
  classDuration: string;
  status: 'Pending' | 'Private' | 'Public';

  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
