import { useState, FormEvent, useEffect } from 'react';
import { useUpdateCoursesMutation } from '@/app/dashboard/course/all/store-api/rtk-Api';
import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: IAllCourse;
}

// Helper function to format date for input[type="date"]
const formatDateForInput = (date?: Date | string): string => {
  if (!date) return '';
  // Converts Date object or ISO string to 'YYYY-MM-DD' format
  return new Date(date).toISOString().split('T')[0];
};

const EditCourseModal = ({ isOpen, onClose, course }: EditCourseModalProps) => {
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

    // Handle number inputs
    if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    // Handle all other inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, enrolmentStatus: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Ensure the ID is correctly passed for the update
      const updateData = { ...formData, id: course._id };
      await updateCourse(updateData).unwrap();
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[65vh] p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input id="courseName" name="courseName" value={formData.courseName || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input id="courseCode" name="courseCode" type="number" value={formData.courseCode || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coursePrice">Price</Label>
                  <Input id="coursePrice" name="coursePrice" type="number" value={formData.coursePrice || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseDuration">Course Duration</Label>
                  <Input id="courseDuration" name="courseDuration" value={formData.courseDuration || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalLecture">Total Lectures</Label>
                  <Input id="totalLecture" name="totalLecture" type="number" value={formData.totalLecture || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPdf">Total PDFs</Label>
                  <Input id="totalPdf" name="totalPdf" type="number" value={formData.totalPdf || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalWord">Total Word Files</Label>
                  <Input id="totalWord" name="totalWord" type="number" value={formData.totalWord || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalLiveClass">Total Live Classes</Label>
                  <Input id="totalLiveClass" name="totalLiveClass" type="number" value={formData.totalLiveClass || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollStudents">Enrolled Students</Label>
                  <Input id="enrollStudents" name="enrollStudents" type="number" value={formData.enrollStudents || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="runningStudent">Running Students</Label>
                  <Input id="runningStudent" name="runningStudent" type="number" value={formData.runningStudent || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrolmentStart">Enrollment Start</Label>
                  <Input id="enrolmentStart" name="enrolmentStart" type="date" value={formatDateForInput(formData.enrolmentStart)} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrolmentEnd">Enrollment End</Label>
                  <Input id="enrolmentEnd" name="enrolmentEnd" type="date" value={formatDateForInput(formData.enrolmentEnd)} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="enrolmentStatus" checked={formData.enrolmentStatus || false} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="enrolmentStatus" className="text-sm font-medium">
                  Enrollment Active
                </Label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseShortDescription">Short Description</Label>
                  <Textarea id="courseShortDescription" name="courseShortDescription" value={formData.courseShortDescription || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseDetails">Course Details</Label>
                  <Textarea id="courseDetails" name="courseDetails" value={formData.courseDetails || ''} onChange={handleChange} rows={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseNote">Notes</Label>
                  <Textarea id="courseNote" name="courseNote" value={formData.courseNote || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea id="certifications" name="certifications" value={formData.certifications || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Reviews (comma-separated)</Label>
                  <Textarea id="review" name="review" value={Array.isArray(formData.review) ? formData.review.join(', ') : ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseBannerPicture">Banner Picture URL</Label>
                  <Input id="courseBannerPicture" name="courseBannerPicture" value={formData.courseBannerPicture || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseIntroVideo">Intro Video URL</Label>
                  <Input id="courseIntroVideo" name="courseIntroVideo" value={formData.courseIntroVideo || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="howCourseIsRunningView">Course Running View Info</Label>
                  <Input id="howCourseIsRunningView" name="howCourseIsRunningView" value={formData.howCourseIsRunningView || ''} onChange={handleChange} />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
