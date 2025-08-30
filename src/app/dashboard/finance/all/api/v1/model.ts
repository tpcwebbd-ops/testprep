import mongoose, { Schema } from 'mongoose';

const financeSchema = new Schema(
  {
    studentName: { type: String },
    studentEinfo: {
      type: String,
      unique: false,
    },
    studentNumber: { type: String },
    courseName: { type: String },
    coursePrice: { type: String },
    coureCode: { type: String },
    batchNo: { type: String },
    paymentStatus: { type: Boolean, default: false },
    discount: { type: String },
    totalPayment: { type: String },
    enrollmentDate: { type: Date, default: Date.now },
    paymentData: { type: Date, default: Date.now },
    verifyWhomName: { type: String },
    verifyWhomEinfo: {
      type: String,
    },
    transectionId: { type: String },
    invoiceNumber: { type: String },
    refundStatus: { type: Boolean, default: false },
    refundAmount: { type: String },
  },
  { timestamps: true },
);

const PaymentFinance = mongoose.models.PaymentFinance || mongoose.model('PaymentFinance', financeSchema);
export default PaymentFinance;

export interface IFinances {
  studentName: string;
  studentEinfo: string;
  studentNumber: string;
  courseName: string;
  coursePrice: string;
  coureCode: string;
  batchNo: string;
  paymentStatus: boolean;
  discount: string;
  totalPayment: string;
  enrollmentDate: Date;
  paymentData: Date;
  verifyWhomName: string;
  verifyWhomEinfo: string;
  transectionId: string;
  invoiceNumber: string;
  refundStatus: boolean;
  refundAmount: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export const defaultFinances = {
  studentName: '',
  studentEinfo: '',
  studentNumber: '',
  courseName: '',
  coursePrice: '',
  coureCode: '',
  batchNo: '',
  paymentStatus: false,
  discount: '',
  totalPayment: '',
  enrollmentDate: new Date(),
  paymentData: new Date(),
  verifyWhomName: '',
  verifyWhomEinfo: '',
  transectionId: '',
  invoiceNumber: '',
  refundStatus: false,
  refundAmount: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  _id: '',
};
