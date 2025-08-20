import { IAllCourse } from '@/app/dashboard/course/all/api/v1/model';

// Import shadcn/ui components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: IAllCourse;
}

// Helper component for displaying a key-value pair
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base text-gray-900">{value}</p>
  </div>
);

const ViewCourseModal = ({ isOpen, course, onClose }: ViewCourseModalProps) => {
  // Function to format dates for display
  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{course.courseName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] p-4">
          <div className="space-y-6">
            <div className="relative w-full h-56 rounded-lg overflow-hidden">
              <Image src={course.courseBannerPicture || '/placeholder.jpg'} alt={course.courseName} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <DetailItem label="Course Code" value={course.courseCode || 'N/A'} />
              <DetailItem label="Price" value={`$${course.coursePrice?.toLocaleString() || '0.00'}`} />
              <DetailItem
                label="Enrollment Status"
                value={<Badge variant={course.enrolmentStatus ? 'default' : 'destructive'}>{course.enrolmentStatus ? 'Active' : 'Inactive'}</Badge>}
              />
              <DetailItem label="Course Duration" value={course.courseDuration || 'N/A'} />
              <DetailItem label="Enrollment Period" value={`${formatDate(course.enrolmentStart)} - ${formatDate(course.enrolmentEnd)}`} />
              <DetailItem label="Total Lectures" value={course.totalLecture || 0} />
              <DetailItem label="Total PDFs" value={course.totalPdf || 0} />
              <DetailItem label="Total Word Files" value={course.totalWord || 0} />
              <DetailItem label="Live Classes" value={course.totalLiveClass || 0} />
              <DetailItem label="Enrolled Students" value={course.enrollStudents || 0} />
              <DetailItem label="Currently Running" value={course.runningStudent || 0} />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <DetailItem label="Short Description" value={course.courseShortDescription || 'N/A'} />
              <DetailItem label="Course Details" value={course.courseDetails || 'N/A'} />
              <DetailItem label="Notes" value={course.courseNote || 'N/A'} />
              <DetailItem label="Certifications" value={course.certifications || 'N/A'} />
              <DetailItem label="Intro Video URL" value={course.courseIntroVideo || 'N/A'} />
              <DetailItem label="How Course is Running" value={course.howCourseIsRunningView || 'N/A'} />
              <DetailItem label="Reviews" value={Array.isArray(course.review) && course.review.length > 0 ? course.review.join(', ') : 'No reviews yet.'} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseModal;
