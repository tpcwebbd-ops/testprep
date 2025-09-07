/* |-----------------------------------------
| Payment Gateway Page for Course Enrollment
| @author: Generated with TypeScript
| @copyright: testprep-webapp, August, 2025
|----------------------------------------- */

import { notFound } from 'next/navigation';
import React from 'react';
import PaymentGateway from './PaymentGateway';

// Type definitions
export interface Course {
  _id: string;
  courseName: string;
  courseCode?: number;
  totalLecture?: number;
  totalPdf?: number;
  totalWord?: number;
  totalLiveClass?: number;
  enrollStudents?: number;
  runningStudent?: number;
  enrolmentStatus: boolean;
  enrolmentStart?: string;
  enrolmentEnd?: string;
  courseDetails?: string;
  review?: string[];
  coursePrice?: number;
  courseDuration?: string;
  courseNote?: string;
  courseShortDescription?: string;
  courseBannerPicture?: string;
  courseIntroVideo?: string;
  howCourseIsRunningView?: string;
  certifications?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ApiResponse {
  data: {
    courses: Course[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
  status: number;
}

// Main API fetch function
const getCourseByTitle = async (title: string): Promise<ApiResponse> => {
  const updateTitle = title?.replaceAll('-', ' ');
  const backendUrl = `${process.env.projectURL}/dashboard/course/all/api/by-course-name?coursename=${updateTitle}`;

  try {
    const res = await fetch(backendUrl, { next: { revalidate: 3600 } });
    const responseData: ApiResponse = await res.json();

    if (!responseData.data.courses.length) {
      notFound();
    }

    return responseData;
  } catch (error) {
    console.error('Failed to fetch course:', error);
    notFound();
  }
};

// Get course data helper
async function getCourseData(title: string): Promise<Course> {
  const data = await getCourseByTitle(title);
  if (!data.data.courses.length) notFound();
  return data.data.courses[0];
}

// Main Page Component
export default async function PaymentPage({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const course = await getCourseData(title);

  // Check if enrollment is still open
  if (!course.enrolmentStatus) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PaymentGateway course={course} />
    </div>
  );
}
