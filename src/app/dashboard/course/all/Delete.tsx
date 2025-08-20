import { useDeleteCoursesMutation } from '@/app/dashboard/course/all/store-api/rtk-Api';
interface DeleteCourseModalProps {
  courseId: string;
  onClose: () => void;
}

const DeleteCourseModal = ({ courseId, onClose }: DeleteCourseModalProps) => {
  const [deleteCourse, { isLoading }] = useDeleteCoursesMutation();

  const handleDelete = async () => {
    try {
      await deleteCourse({ id: courseId }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300">
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
