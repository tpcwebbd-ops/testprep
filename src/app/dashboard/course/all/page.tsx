'use client';

import { useState } from 'react';
import { useGetCoursesQuery } from '@/app/dashboard/course/all/store-api/rtk-Api';

import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';
import AddCourseModal from './Add';
import EditCourseModal from './Edit';
import DeleteCourseModal from './Delete';
import ViewCourseModal from './View';
import { FiMoreVertical, FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Image from 'next/image';

const CoursesPage = () => {
  const { data, error, isLoading } = useGetCoursesQuery({ page: 1, limit: 10, q: '' });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<IAllCourse | null>(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (course: IAllCourse) => {
    setSelectedCourse(course);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedCourse(null);
    setEditModalOpen(false);
  };

  const openDeleteModal = (course: IAllCourse) => {
    setSelectedCourse(course);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedCourse(null);
    setDeleteModalOpen(false);
  };

  const openViewModal = (course: IAllCourse) => {
    setSelectedCourse(course);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedCourse(null);
    setViewModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;
  console.log(' Data :', data);
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FiPlus className="mr-2" /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.data?.courses?.length === 0 && <p className="text-center text-gray-500 text-4xl">No courses available</p>}
        {data?.data?.courses?.map((course: IAllCourse) => (
          <div key={course._id as string} className="bg-white rounded-lg shadow-lg overflow-hidden relative group">
            <Image
              onClick={() => openViewModal(course)}
              loading="lazy"
              src={course.courseBannerPicture || '/placeholder.jpg'}
              alt={course.courseName}
              className="w-full h-40 object-cover cursor-pointer"
              width={400}
              height={200}
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{course.courseName}</h3>
              <p className="text-sm text-gray-500 mt-1">Code: {course.courseCode || 'N/A'}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-blue-600 font-bold">${course.coursePrice || 0}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${course.enrolmentStatus ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {course.enrolmentStatus ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="relative">
                <button className="p-2 rounded-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FiMoreVertical />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 hidden group-focus-within:block">
                  <button
                    onClick={() => openViewModal(course)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer"
                  >
                    <FiEye className="mr-2" /> View
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex items-center cursor-pointer"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(course)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-200 flex items-center cursor-pointer"
                  >
                    <FiTrash2 className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && <AddCourseModal onClose={closeAddModal} isOpen={isAddModalOpen} />}
      {isEditModalOpen && selectedCourse && <EditCourseModal isOpen={isEditModalOpen} onClose={closeEditModal} course={selectedCourse} />}
      {isDeleteModalOpen && selectedCourse && <DeleteCourseModal courseId={selectedCourse._id as string} onClose={closeDeleteModal} />}
      {isViewModalOpen && selectedCourse && <ViewCourseModal isOpen={isViewModalOpen} course={selectedCourse} onClose={closeViewModal} />}
    </div>
  );
};

export default CoursesPage;
