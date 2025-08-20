import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

interface ViewCourseModalProps {
  course: IAllCourse;
  onClose: () => void;
}

const ViewCourseModal = ({ course, onClose }: ViewCourseModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{course.courseName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <img src={course.courseBannerPicture || '/placeholder.jpg'} alt={course.courseName} className="w-full h-48 object-cover rounded-md mb-4" />
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Code:</strong> {course.courseCode || 'N/A'}
          </p>
          <p>
            <strong>Price:</strong> ${course.coursePrice || 0}
          </p>
          <p>
            <strong>Duration:</strong> {course.courseDuration || 'N/A'}
          </p>
          <p>
            <strong>Enrolled Students:</strong> {course.enrollStudents || 0}
          </p>
          <p>
            <strong>Status:</strong> {course.enrolmentStatus ? 'Open for Enrollment' : 'Closed'}
          </p>
          <p className="pt-2">
            <strong>Description:</strong> {course.courseShortDescription || 'No description available.'}
          </p>
          {/* Add more fields to display as needed */}
        </div>
        <div className="text-right mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal;
