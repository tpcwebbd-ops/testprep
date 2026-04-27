import { getAllCourses } from '@/app/api/courses/v1/controller';
import CoursesPageClient from './CoursesPageClient';

export const dynamic = 'force-static';

interface Course {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  realPrice?: number;
  discountPrice?: number;
  isActive?: boolean;
}

export default async function CoursesPage() {
  const result = await getAllCourses();
  const allCourses: Course[] = result?.data?.courses ?? [];
  const courses = allCourses.filter((c: Course) => c.isActive !== false);

  return <CoursesPageClient courses={courses} />;
}
