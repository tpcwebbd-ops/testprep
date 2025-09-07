/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

import { Eye, ShoppingCart, Users, BookOpen, Video, FileText, Clock, Award, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// It's a good practice to keep type definitions in a separate file (e.g., `types.ts`)
// and import them where needed. For this example, they are included here.
interface Course {
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

/**
 * Fetches course data from the API.
 * This function is called on the server at request time.
 */
async function getCourses(): Promise<Course[]> {
  try {
    // In a real application, you would replace 'localhost' with your actual domain.
    // The `cache: 'no-store'` option ensures that the data is fetched fresh for each request (SSR).
    const res = await fetch(`${process.env.projectURL}/dashboard/course/all/api/v1`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data: ApiResponse = await res.json();
    return data.data.courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return an empty array to prevent the page from crashing.
    return [];
  }
}

/**
 * This is a Server Component that fetches data and renders the course catalog.
 */
const CourseCatalogPage = async () => {
  const courses = await getCourses();

  // Helper function to format the price
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Render a message if courses could not be loaded.
  if (!courses || courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Could Not Load Courses</h2>
          <p className="text-gray-600">There was an issue fetching the course catalog. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              IELTS Course Catalog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Master the IELTS exam with our comprehensive courses designed by expert instructors</p>
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            // Generate a URL-friendly slug from the course name
            const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');

            return (
              <div
                key={course._id + idx}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
              >
                {/* Course Banner */}
                <Link href={`/course/${courseSlug}`} className="cursor-pointer">
                  <div className="relative overflow-hidden h-48">
                    <Image
                      fill
                      src={course.courseBannerPicture || '/icons/icon-1280x720-1.png'}
                      alt={course.courseName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {/* Enrollment Status Badge */}
                    <div className="absolute top-4 right-4">
                      {course.enrolmentStatus ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">Open</span>
                      ) : (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">Closed</span>
                      )}
                    </div>
                    {/* Course Code */}
                    {course.courseCode && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">#{course.courseCode}</span>
                      </div>
                    )}
                    {/* Course Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{course.courseName}</h3>
                    </div>
                  </div>
                </Link>

                {/* Course Content */}
                <div className="p-6">
                  {/* Short Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.courseShortDescription || 'Comprehensive IELTS preparation course'}</p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Video className="w-4 h-4 text-blue-500" />
                      <span>{course.totalLecture || 0} Lectures</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>{course.totalPdf || 0} PDFs</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>{course.enrollStudents || 0} Students</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{course.courseDuration || 'Flexible'}</span>
                    </div>
                  </div>

                  {/* Reviews */}
                  {course.review && course.review.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({course.review.length} reviews)</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(course.coursePrice)}</div>
                    {course.enrolmentStatus && <div className="text-sm text-green-600 font-medium">Enrollment Open</div>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/course/${courseSlug}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold group/btn"
                    >
                      <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      <span>View Details</span>
                    </Link>

                    <Link
                      href={`/course/payment/${course.courseName.replaceAll(' ', '-').toLowerCase()}`}
                      aria-disabled={!course.enrolmentStatus}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group/btn ${
                        course.enrolmentStatus
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      <span>{course.enrolmentStatus ? 'Purchase' : 'Unavailable'}</span>
                    </Link>
                  </div>

                  {/* Additional Info */}
                  {course.totalLiveClass && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-blue-700">
                        <Award className="w-4 h-4" />
                        <span>{course.totalLiveClass} Live Classes Included</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <section className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose Our IELTS Courses?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-2">1000+</div>
              <div className="text-blue-700 font-medium">Students Enrolled</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-900 mb-2">100+</div>
              <div className="text-green-700 font-medium">Hours of Content</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-900 mb-2">95%</div>
              <div className="text-purple-700 font-medium">Success Rate</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-900 mb-2">4.9</div>
              <div className="text-orange-700 font-medium">Average Rating</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseCatalogPage;
