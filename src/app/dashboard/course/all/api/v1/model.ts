import mongoose, { Schema, Document } from 'mongoose';

const allCourseSchema = new Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: Number },
    totalLecture: { type: Number },
    totalPdf: { type: Number },
    totalWord: { type: Number }, // Correctly named 'totalWord'
    totalLiveClass: { type: Number },
    enrollStudents: { type: Number },
    runningStudent: { type: Number },
    enrolmentStatus: { type: Boolean },
    enrolmentStart: { type: Date },
    enrolmentEnd: { type: Date },
    courseDetails: { type: String },
    review: [
      {
        type: String, // Schema expects an array of strings
      },
    ],
    coursePrice: { type: Number },
    courseDuration: { type: String },
    courseNote: { type: String },
    courseShortDescription: { type: String },
    courseBannerPicture: { type: String },
    courseIntroVideo: { type: String },
    howCourseIsRunningView: { type: String },
    certifications: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.AllCourse || mongoose.model('AllCourse', allCourseSchema);

// The interface now correctly reflects the schema and extends Document
export interface IAllCourse extends Document {
  courseName: string;
  courseCode?: number;
  totalLecture?: number;
  totalPdf?: number;
  totalWord?: number; // Corrected from totalWordFile
  totalLiveClass?: number;
  enrollStudents?: number;
  runningStudent?: number;
  enrolmentStatus?: boolean;
  enrolmentStart?: Date;
  enrolmentEnd?: Date;
  courseDetails?: string;
  review?: string[]; // Corrected to be an array of strings
  coursePrice?: number;
  courseDuration?: string;
  courseNote?: string;
  courseShortDescription?: string;
  courseBannerPicture?: string;
  courseIntroVideo?: string;
  howCourseIsRunningView?: string;
  certifications?: string;
}

// The default data now matches the corrected interface and schema
export const defaultCoursesData: Omit<IAllCourse, keyof Document> = {
  courseName: '',
  courseCode: 101,
  totalLecture: 25,
  totalPdf: 15,
  totalWord: 10, // Corrected from totalWordFile
  totalLiveClass: 5,
  enrollStudents: 200,
  runningStudent: 150,
  enrolmentStatus: true,
  enrolmentStart: new Date('2025-09-01T00:00:00.000Z'),
  enrolmentEnd: new Date('2026-08-31T23:59:59.000Z'),
  courseDetails: '',
  review: [], // Example data now matches the string[] type
  coursePrice: 5000,
  courseDuration: '1 Year',
  courseNote: '',
  courseShortDescription: '',
  courseBannerPicture: '/images/banner_picture.jpg',
  courseIntroVideo: '/videos/intro_video.mp4',
  howCourseIsRunningView: '',
  certifications: '',
};
