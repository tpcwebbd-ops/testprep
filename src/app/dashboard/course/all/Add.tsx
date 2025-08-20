import { useState, FormEvent } from 'react';
import { useAddCoursesMutation } from '@/app/dashboard/course/all/store-api/rtk-Api';
import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

interface AddCourseModalProps {
  onClose: () => void;
}

const AddCourseModal = ({ onClose }: AddCourseModalProps) => {
  const [addCourse, { isLoading }] = useAddCoursesMutation();
  const [formData, setFormData] = useState<Partial<IAllCourse>>({
    courseName: '',
    courseCode: undefined,
    coursePrice: undefined,
    courseDuration: '',
    courseShortDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addCourse(formData).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              id="courseName"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          {/* Add other form fields based on your interface */}
          <div>
            <label htmlFor="coursePrice" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="coursePrice"
              id="coursePrice"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="courseShortDescription" className="block text-sm font-medium text-gray-700">
              Short Description
            </label>
            <textarea
              name="courseShortDescription"
              id="courseShortDescription"
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;
