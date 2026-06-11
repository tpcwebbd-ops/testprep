/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const enrollmentSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
    studentsStatus: { type: String, default: 'active', enum: ['blocked', 'pending', 'complete', 'running'] },
    enrollmentDate: { type: Date, default: Date.now },
    enrollCoursesIDS: [{ type: String }],
    realPrice: { type: Number },
    discountPrice: { type: Number, default: 0 },
    paymentAmount: { type: Number },
    paymentMethod: { type: String },
    couponCode: { type: String, default: null },
    checkedbyEmail: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    tranId: { type: String, default: null },
    sslValId: { type: String, default: null },
  },
  { _id: true, timestamps: true },
);

enrollmentSchema.index({ studentEmail: 1 });
enrollmentSchema.index({ studentName: 1 });
enrollmentSchema.index({ couponCode: 1 });
enrollmentSchema.index({ tranId: 1 }, { sparse: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
