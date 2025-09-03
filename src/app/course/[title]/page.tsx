/* |-----------------------------------------
| Course Details Page for IELTS Courses
| @author: Generated with TypeScript
| @copyright: testprep-webapp, August, 2025
|----------------------------------------- */

import { notFound } from 'next/navigation';
import React from 'react';
import { Play, Users, BookOpen, Video, FileText, Award, Star, Calendar, CheckCircle, Target, TrendingUp } from 'lucide-react';
import BackToCourse from './BackToCourse';
import PurchaseButton from './PurchaseButton';
import Image from 'next/image';

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

// Animated Background Component
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

      {/* Floating Circles */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-bounce delay-0"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200/30 rounded-full animate-bounce delay-2000"></div>
      <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-pink-200/30 rounded-full animate-bounce delay-500"></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-blue-300/20 rotate-45 animate-pulse delay-300"></div>
      <div className="absolute top-2/3 right-1/4 w-6 h-6 bg-purple-300/20 rotate-12 animate-pulse delay-700"></div>

      {/* Moving Gradients */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-spin"
        style={{ animationDuration: '20s' }}
      ></div>
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-pink-400/10 rounded-full animate-spin"
        style={{ animationDuration: '25s', animationDirection: 'reverse' }}
      ></div>
    </div>
  );
};

// Course Stats Component
const CourseStats: React.FC<{ course: Course }> = ({ course }) => {
  const stats = [
    { icon: Video, label: 'Video Lectures', value: course.totalLecture || 0, color: 'blue' },
    { icon: FileText, label: 'PDF Materials', value: course.totalPdf || 0, color: 'green' },
    { icon: BookOpen, label: 'Word Files', value: course.totalWord || 0, color: 'purple' },
    { icon: Users, label: 'Live Classes', value: course.totalLiveClass || 0, color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div
            className={`w-16 h-16 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
          >
            <stat.icon className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
          <div className="text-sm font-medium text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// Course Details Component
const CourseDetailsComponent: React.FC<{ course: Course }> = ({ course }) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              fill
              src={course.courseBannerPicture || 'https://i.ibb.co.com/PGXYXwTq/img.jpg'}
              alt={course.courseName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              {/* Back Button */}
              {/* <button
                onClick={handleBackToCourses}
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors duration-300"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Back to Courses</span>
              </button> */}
              <BackToCourse />
              {/* Course Badge */}
              {course.courseCode && (
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Course #{course.courseCode}
                </div>
              )}
              {/* Course Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">{course.courseName}</h1>
              {/* Short Description */}
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed">
                {course.courseShortDescription || course.courseDetails}
              </p>
              {/* Enrollment Status */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold ${
                    course.enrolmentStatus ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{course.enrolmentStatus ? 'Enrollment Open' : 'Enrollment Closed'}</span>
                </div>

                {course.enrollStudents && (
                  <div className="flex items-center space-x-2 text-white/90">
                    <Users className="w-5 h-5" />
                    <span>{course.enrollStudents} students enrolled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Stats */}
              <CourseStats course={course} />

              {/* Course Overview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <span>Course Overview</span>
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {course.courseDetails ||
                    'This comprehensive IELTS course is designed to help you achieve your target score with expert guidance and proven methodologies.'}
                </p>

                {/* How Course is Running */}
                {course.howCourseIsRunningView && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <span>How This Course Works</span>
                    </h3>
                    <p className="text-gray-700">{course.howCourseIsRunningView}</p>
                  </div>
                )}

                {/* Course Notes */}
                {course.courseNote && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span>Important Notes</span>
                    </h3>
                    <p className="text-gray-700">{course.courseNote}</p>
                  </div>
                )}
              </div>

              {/* Certifications */}
              {course.certifications && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <Award className="w-8 h-8 text-purple-600" />
                    <span>Certification</span>
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{course.certifications}</p>
                </div>
              )}

              {/* Reviews */}
              {course.review && course.review.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <span>Student Reviews</span>
                  </h2>
                  <div className="space-y-4">
                    {course.review.map((review: string, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-l-4 border-yellow-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i: number) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 italic">&quot;{review}&quot;</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                    <div className="text-4xl font-bold mb-2">৳{course.coursePrice?.toLocaleString() || 'Contact'}</div>
                    <div className="text-blue-100">{course.courseDuration && `Duration: ${course.courseDuration}`}</div>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Enrollment Dates */}
                    {course.enrolmentStart && course.enrolmentEnd && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-semibold">Enrollment Start</div>
                            <div className="text-sm">{formatDate(course.enrolmentStart)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-semibold">Enrollment End</div>
                            <div className="text-sm">{formatDate(course.enrolmentEnd)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Student Count */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-gray-900">Active Students</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{course.runningStudent || 0}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      {/* <button
                        onClick={handlePurchase}
                        disabled={!course.enrolmentStatus}
                        className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                          course.enrolmentStatus
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        type="button"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        <span>{course.enrolmentStatus ? 'Enroll Now' : 'Enrollment Closed'}</span>
                      </button> */}

                      <PurchaseButton course={course} />

                      {/* Preview Button */}
                      {course.courseIntroVideo && (
                        <button
                          className="w-full flex items-center justify-center space-x-3 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold transform hover:scale-105"
                          type="button"
                        >
                          <Play className="w-6 h-6" />
                          <span>Preview Course</span>
                        </button>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">What&quot;s Included:</h3>
                      <div className="space-y-2">
                        {course.totalLecture && (
                          <div className="flex items-center space-x-3 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{course.totalLecture} Video Lectures</span>
                          </div>
                        )}
                        {course.totalPdf && (
                          <div className="flex items-center space-x-3 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{course.totalPdf} Downloadable PDFs</span>
                          </div>
                        )}
                        {course.totalLiveClass && (
                          <div className="flex items-center space-x-3 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{course.totalLiveClass} Live Interactive Sessions</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Lifetime Access</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Certificate of Completion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main API fetch function
const getCourseByTitle = async (title: string): Promise<ApiResponse> => {
  const updateTitle = title.replaceAll('-', ' ');
  const backendUrl = `https://testprep-bd.vercel.app/dashboard/course/all/api/by-course-name?coursename=${updateTitle}`;

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

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const course = await getCourseData(title);

  return {
    title: `${course.courseName} - IELTS Course Details`,
    description: course.courseShortDescription || course.courseDetails,
    openGraph: {
      title: course.courseName,
      description: course.courseShortDescription || course.courseDetails,
      images: [course.courseBannerPicture || 'https://i.ibb.co.com/PGXYXwTq/img.jpg'],
    },
  };
}

// Main Page Component
export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const course = await getCourseData(title);

  return (
    <div className="min-h-screen">
      <CourseDetailsComponent course={course} />
    </div>
  );
}
