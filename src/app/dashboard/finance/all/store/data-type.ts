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
