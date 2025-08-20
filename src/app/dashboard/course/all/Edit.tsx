import { useState, FormEvent, useEffect } from 'react';
import { useUpdateCoursesMutation } from '@/app/dashboard/course/all/store-api/rtk-Api';
import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

interface EditCourseModalProps {
  course: IAllCourse;
  onClose: () => void;
}

// Helper function to format date for input[type="date"]
const formatDateForInput = (date?: Date | string): string => {
  if (!date) return '';
  // Converts Date object or ISO string to 'YYYY-MM-DD' format
  return new Date(date).toISOString().split('T')[0];
};

const EditCourseModal = ({ course, onClose }: EditCourseModalProps) => {
  const [updateCourse, { isLoading }] = useUpdateCoursesMutation();
  const [formData, setFormData] = useState<Partial<IAllCourse>>({});

  useEffect(() => {
    if (course) {
      // Set the form data with all fields from the course object
      setFormData({ ...course });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    // Handle number inputs
    if (type === 'number') {
      // Allow clearing the number field
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    // Handle all other inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updateData = { ...formData, id: formData._id };
      updateData.id = course._id;
      console.log('updateData : ', updateData);
      await updateCourse(updateData).unwrap();

      onClose(); // Close modal on success
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  // Helper function to render input fields and reduce repetition
  const renderInput = (name: keyof IAllCourse, label: string, type: string = 'text', required: boolean = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={type === 'date' ? formatDateForInput(formData[name] as Date | string) : (formData[name] as any) || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        required={required}
      />
    </div>
  );

  const renderTextArea = (name: keyof IAllCourse, label: string, rows: number = 3) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        value={(formData[name] as string) || ''}
        onChange={handleChange}
        rows={rows}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      ></textarea>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput('courseName', 'Course Name', 'text', true)}
            {renderInput('courseCode', 'Course Code', 'number')}
            {renderInput('coursePrice', 'Price', 'number')}
            {renderInput('courseDuration', 'Course Duration')}
            {renderInput('totalLecture', 'Total Lectures', 'number')}
            {renderInput('totalPdf', 'Total PDFs', 'number')}
            {renderInput('totalWord', 'Total Word Files', 'number')}
            {renderInput('totalLiveClass', 'Total Live Classes', 'number')}
            {renderInput('enrollStudents', 'Enrolled Students', 'number')}
            {renderInput('runningStudent', 'Running Students', 'number')}
            {renderInput('enrolmentStart', 'Enrollment Start', 'date')}
            {renderInput('enrolmentEnd', 'Enrollment End', 'date')}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="enrolmentStatus"
              id="enrolmentStatus"
              checked={formData.enrolmentStatus || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="enrolmentStatus" className="text-sm font-medium text-gray-700">
              Enrollment Active
            </label>
          </div>

          <div className="space-y-4">
            {renderTextArea('courseShortDescription', 'Short Description')}
            {renderTextArea('courseDetails', 'Course Details', 5)}
            {renderTextArea('courseNote', 'Notes')}
            {renderTextArea('certifications', 'Certifications')}
            {renderInput('courseBannerPicture', 'Banner Picture URL')}
            {renderInput('courseIntroVideo', 'Intro Video URL')}
            {renderInput('howCourseIsRunningView', 'Course Running View Info')}
            {renderTextArea('review', 'Reviews (comma-separated)')}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
              {isLoading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
