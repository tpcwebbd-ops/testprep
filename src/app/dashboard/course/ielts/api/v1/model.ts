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
    description: { type: String },
    details: { type: String },
    enrollmentStatus: { type: Boolean },
    enrollmentStateDate: { type: Date },
    enrollmentEndDate: { type: Date },
    price: { type: Number },
    numberOfClass: { type: Number },
    classDuration: { type: String },
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
  description: string;
  details: string;
  enrollmentStatus: boolean;
  enrollmentStateDate: Date;
  enrollmentEndDate: Date;
  price: number;
  numberOfClass: number;
  classDuration: string;

  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
