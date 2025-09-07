// types.ts

export interface Attendance {
  dateAndTime: string;
  lectureName: string;
  _id: string;
}

export interface Student {
  studentName: string;
  studentEmail: string;
  studentCourse: string;
  startDate: string;
  endDate: string;
  attendanceLst: Attendance[];
  _id: string;
}

export interface Mentor {
  mentorName: string;
  mentorEmail: string;
  studentsLst: Student[];
  _id: string;
}

export interface Batch {
  _id: string;
  batchInfo: string;
  batchName: string;
  mentorInfo: Mentor[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  data: {
    batches: Batch[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}
