/*
|-----------------------------------------
| Course Playlist Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { motion } from 'framer-motion';
import { PlayCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Course, ClassItem } from './course-data';

// Helper to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

interface CoursePlaylistProps {
  courseData: Course[];
  onSelectContent: (content: ClassItem) => void;
  selectedContentId: number;
}

interface AttendanceRecord {
  id: number;
  dateAndTime: string;
  lecture: string;
}

const CoursePlaylist = ({ courseData, onSelectContent, selectedContentId }: CoursePlaylistProps) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todaysLecture, setTodaysLecture] = useState<ClassItem | null>(null);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);

  // Load attendance and task completion status from localStorage on initial render
  useEffect(() => {
    const savedAttendance = localStorage.getItem('attendance');
    const today = new Date();

    if (savedAttendance) {
      const parsedAttendance = JSON.parse(savedAttendance);
      setAttendance(parsedAttendance);

      const todaysRecord = parsedAttendance.find((record: AttendanceRecord) => isSameDay(new Date(record.dateAndTime), today));
      if (todaysRecord) {
        const allLectures = courseData.flatMap(course => course.classList);
        const lecture = allLectures.find(l => l.title === todaysRecord.lecture);
        if (lecture) {
          setTodaysLecture(lecture);
          onSelectContent(lecture);
        }
      }
    }
    const savedCompletion = localStorage.getItem('taskCompletedDate');
    if (savedCompletion && isSameDay(new Date(savedCompletion), today)) {
      setTaskCompleted(true);
    }
  }, [courseData, onSelectContent]);

  // Update localStorage when attendance changes
  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const handleAttendanceClick = () => {
    const allLectures = courseData.flatMap(course => course.classList);
    const nextLectureIndex = attendance.length;

    if (nextLectureIndex < allLectures.length) {
      const nextLecture = allLectures[nextLectureIndex];
      const newAttendanceRecord: AttendanceRecord = {
        id: attendance.length + 1,
        dateAndTime: new Date().toISOString(),
        lecture: nextLecture.title,
      };
      setAttendance([...attendance, newAttendanceRecord]);
      setTodaysLecture(nextLecture);
      onSelectContent(nextLecture);
    }
  };

  const handleMarkAsComplete = () => {
    setTaskCompleted(true);
    localStorage.setItem('taskCompletedDate', new Date().toISOString());
  };

  return (
    <div className="w-full rounded-lg bg-white p-2 shadow-md md:p-4">
      {/* Phase 1: Attendance Not Submitted */}
      {!todaysLecture && (
        <div className="mb-4 text-center">
          <button onClick={handleAttendanceClick} className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600">
            Attendance
          </button>
        </div>
      )}

      {/* Phases 2 & 3: Attendance Submitted */}
      {todaysLecture && (
        <>
          {/* Phase 2: Lecture Not Completed */}
          {!taskCompleted && (
            <div className="mb-4 rounded-lg border bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-blue-800">Today&apos;s Lecture: {todaysLecture.title}</h3>
              <button onClick={handleMarkAsComplete} className="mt-2 rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600">
                Mark as Complete
              </button>
            </div>
          )}

          {/* Phase 3: Lecture Completed */}
          {taskCompleted && (
            <div className="mb-4 rounded-lg border bg-green-100 p-4 text-center">
              <p className="font-semibold text-green-800">You have finished all tasks for today.</p>
            </div>
          )}

          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <Accordion type="single" collapsible className="w-full">
              {courseData.map(course => (
                <AccordionItem key={course.id} value={`item-${course.id}`} className="mb-2 rounded-lg border bg-slate-50 px-4 last:mb-0">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">{course.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4 flex justify-between border-b pb-2 text-sm text-gray-500">
                      <span>{course.totalClass} Classes</span>
                      <span>{course.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {course.classList.map((item, index) => (
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
                            <PlayCircle className="mr-2 h-5 w-5" />
                            <span className="font-semibold">{item.title}</span>
                          </div>
                          <span className="text-xs">{item.duration}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          <div className="mt-4 text-center">
            <button onClick={() => setShowAttendancePopup(true)} className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-all hover:bg-gray-800">
              My Attendance
            </button>
          </div>
        </>
      )}

      {showAttendancePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button onClick={() => setShowAttendancePopup(false)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <h2 className="mb-4 text-xl font-bold">My Attendance</h2>
            <ul className="space-y-2">
              {attendance.map(record => (
                <li key={record.id} className="rounded-md border p-3">
                  <p className="font-semibold">{record.lecture}</p>
                  <p className="text-sm text-gray-500">{new Date(record.dateAndTime).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlaylist;
