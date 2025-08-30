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
