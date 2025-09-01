/*
|-----------------------------------------
| Course Playlist Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { motion } from 'framer-motion';
import { ClassItem } from './page'; // Adjust the import path as needed
import { Course } from './course-data';

interface CoursePlaylistProps {
  courseData: Course[];
  onSelectContent: (content: ClassItem) => void;
  selectedContentId: number;
}

const CoursePlaylist = ({ courseData, onSelectContent, selectedContentId }: CoursePlaylistProps) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      {courseData.map(course => (
        <div key={course.id}>
          <h2 className="mb-2 text-xl font-bold text-gray-800">{course.title}</h2>
          <div className="mb-4 flex justify-between text-sm text-gray-500">
            <span>{course.totalClass} Classes</span>
            <span>Duration: {course.duration}</span>
          </div>
          <ul className="space-y-2">
            {course.classList.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onSelectContent(item)}
                className={`cursor-pointer rounded-md p-3 transition-all duration-200 ${
                  selectedContentId === item.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs">{item.duration}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CoursePlaylist;
