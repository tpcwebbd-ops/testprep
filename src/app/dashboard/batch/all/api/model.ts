import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
  dateAndTime: { type: String },
  lectureName: { type: String },
});

const studentSchema = new Schema({
  studentName: { type: String },
  studentEmail: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  studentCourse: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  attendanceLst: [attendanceSchema],
});

const mentorSchema = new Schema({
  mentorName: { type: String },
  mentorEmail: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  studentsLst: [studentSchema],
});

const batchSchema = new Schema(
  {
    batchInfo: { type: String, required: false },
    batchName: {
      type: String,
      required: true,
      unique: true,
    },
    mentorInfo: [mentorSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Batch || mongoose.model('Batch', batchSchema);

export interface IAttendance extends mongoose.Document {
  dateAndTime: string;
  lectureName: string;
}

export interface IStudent extends mongoose.Document {
  studentName: string;
  studentEmail: string;
  studentCourse: string;
  startDate: string;
  endDate: string;
  attendanceLst: IAttendance[];
}

export interface IMentor extends mongoose.Document {
  mentorName: string;
  mentorEmail: string;
  studentsLst: IStudent[];
}

export interface IBatch extends mongoose.Document {
  batchInfo?: string;
  batchName: string;
  mentorInfo: IMentor[];
  createdAt: Date;
  updatedAt: Date;
}
