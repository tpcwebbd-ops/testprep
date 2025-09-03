/*
|-----------------------------------------
| Course Playlist Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClassItem, allCourseData } from './course-data'; // Corrected: Added courseData import

export interface AttendanceRecord {
  id: number;
  date: string;
  lectureId: number;
  lectureTitle: string;
}

interface CoursePlaylistProps {
  unlockedLectures: ClassItem[];
  todaysLecture: ClassItem | null;
  onSelectContent: (content: ClassItem) => void;
  selectedContentId: number;
  phase: 'ATTENDANCE_PENDING' | 'LECTURE_IN_PROGRESS' | 'LECTURE_COMPLETED';
  attendance: AttendanceRecord[];
  onNextLecture: () => void;
}

const CoursePlaylist = ({ unlockedLectures, todaysLecture, onSelectContent, selectedContentId, phase, attendance, onNextLecture }: CoursePlaylistProps) => {
  // We will assume the course data is structured into one course for this example
  const course = allCourseData[0];
  console.log('course : ', course);
  console.log('unlockedLectures : ', unlockedLectures);

  return (
    <div className="w-full rounded-lg bg-white p-2 shadow-md md:p-4">
      {todaysLecture && (
        <div className={`mb-4 rounded-lg border p-4 ${phase === 'LECTURE_COMPLETED' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
          <h3 className={`text-lg font-semibold ${phase === 'LECTURE_COMPLETED' ? 'text-green-800' : 'text-blue-800'}`}>
            Today&apos;s Lecture: {todaysLecture.title}
          </h3>
          {phase === 'LECTURE_COMPLETED' && <p className="mt-1 text-sm text-green-700">Completed!</p>}
        </div>
      )}

      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="mb-2 rounded-lg border bg-slate-50 px-4 last:mb-0">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">{course.title}</AccordionTrigger>
            <AccordionContent>
              <div className="mb-4 flex justify-between border-b pb-2 text-sm text-gray-500">
                <span>{unlockedLectures.length} Unlocked Classes</span>
                {/* Duration can be calculated based on unlocked lectures if needed */}
              </div>
              <ul className="space-y-2">
                {unlockedLectures.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => onSelectContent(item)}
                    className={`flex cursor-pointer items-center justify-between rounded-md p-3 transition-all duration-200 ${
                      selectedContentId === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {phase === 'LECTURE_COMPLETED' && todaysLecture?.id === item.id ? (
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      ) : (
                        <PlayCircle className="mr-2 h-5 w-5" />
                      )}
                      <span className="font-semibold">{item.title}</span>
                    </div>
                    <span className="text-xs">{item.duration}</span>
                  </motion.li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <div className="mt-4 flex flex-col items-center gap-4">
        {phase === 'LECTURE_COMPLETED' && (
          <button onClick={onNextLecture} className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition-all hover:bg-green-600">
            Next Lecture
          </button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white transition-all hover:bg-gray-800">My Attendance</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>My Attendance</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <ul className="space-y-2">
                {attendance.map(record => (
                  <li key={record.id} className="rounded-md border p-3">
                    <p className="font-semibold">{record.lectureTitle}</p>
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CoursePlaylist;
