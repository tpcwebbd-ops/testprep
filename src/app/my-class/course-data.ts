/*
|-----------------------------------------
| Course Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface ClassItem {
  id: number;
  title: string;
  duration: string;
  type: 'modal' | 'video' | 'Questions';
  modelCentent?: string;
  videoUrl?: string;
  questionsData?: Question[];
}

export interface Course {
  id: number;
  title: string;
  totalClass: number;
  duration: string;
  classList: ClassItem[];
}

export const calculateTotalVideoDuration = (classList: ClassItem[]): string => {
  const totalSeconds = classList
    .filter(item => item.type === 'video' && item.duration)
    .reduce((accumulator, currentItem) => {
      const timeParts = currentItem.duration.split(':').map(Number);
      const minutes = timeParts[0] || 0;
      const seconds = timeParts[1] || 0;
      return accumulator + minutes * 60 + seconds;
    }, 0);

  if (totalSeconds === 0) {
    return '0 minutes';
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  return parts.join(' ');
};

const classList: ClassItem[] = [
  {
    id: 1,
    title: '1-1 Introduction',
    duration: '02:30',
    modelCentent: '<strong>Carefull</strong> <h2>Todays Topic: Spoken</h2> <p>some text</p>',
    type: 'modal',
  },
  { id: 2, title: '1-2 Basic Spoken', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 3, title: '1-3 Pronunciation', duration: '12:15', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 4, title: '1-4 Common Phrases', duration: '08:45', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 5, title: '1-5 Intonation', duration: '11:05', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 6, title: '1-6 Linking Sounds', duration: '09:30', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 7, title: '1-7 Active Listening', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 8, title: '1-8 Vocabulary Building', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  { id: 9, title: '1-9 Review', duration: '05:00', videoUrl: 'https://www.youtube.com/embed/1S3jlxzDycs?si=1qNTrJByHxRCUyWl', type: 'video' },
  {
    id: 10,
    title: '1-10 Knowledge Check',
    duration: '15:00',
    type: 'Questions',
    questionsData: [
      { id: 1, question: 'What is the capital of Bangladesh?', options: ['Dhaka', 'Chittagong', 'Sylhet', 'Barisal'], answer: 'Dhaka' },
      { id: 2, question: 'What is the currency of Bangladesh?', options: ['BDT', 'USD', 'EUR', 'GBP'], answer: 'BDT' },
      { id: 3, question: 'What is the largest city in Bangladesh by area?', options: ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'], answer: 'Dhaka' },
      {
        id: 4,
        question: 'What is the smallest district in Bangladesh by area?',
        options: ['Narayanganj', 'Dhaka', 'Barisal', 'Sylhet'],
        answer: 'Narayanganj',
      },
      {
        id: 5,
        question: 'What was the population of Bangladesh in early 2024?',
        options: ['~16 million', '~18 million', '~174 million', '~22 million'],
        answer: '~174 million',
      },
      {
        id: 6,
        question: 'What is the largest administrative division in Bangladesh by area?',
        options: ['Dhaka', 'Chittagong', 'Sylhet', 'Barisal'],
        answer: 'Chittagong',
      },
      {
        id: 7,
        question: 'What is the smallest administrative division in Bangladesh by area?',
        options: ['Mymensingh', 'Chittagong', 'Sylhet', 'Barisal'],
        answer: 'Mymensingh',
      },
      { id: 8, question: 'What is the capital of Bangladesh?', options: ['Dhaka', 'Chittagong', 'Sylhet', 'Barisal'], answer: 'Dhaka' },
      { id: 9, question: 'What is the currency of Bangladesh?', options: ['BDT', 'USD', 'EUR', 'GBP'], answer: 'BDT' },
      {
        id: 10,
        question: 'When is the Independence Day of Bangladesh?',
        options: ['25 March', '26 March', '27 March', '28 March'],
        answer: '26 March',
      },
    ],
  },
];

const totalClasses = classList.length;
const totalDuration = calculateTotalVideoDuration(classList);

export const courseData: Course[] = [
  {
    id: 1,
    title: 'Lecture 1 Basic Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 2,
    title: 'Lecture 2 Mid Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 3,
    title: 'Lecture 3 Advanced Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 4,
    title: 'Lecture 4 Practice 1 Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 5,
    title: 'Lecture 5 Practice 2 Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 6,
    title: 'Lecture 6 Practice 3 Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
  {
    id: 7,
    title: 'Lecture 7 Practice 4 Spoken',
    totalClass: totalClasses,
    duration: totalDuration,
    classList: classList,
  },
];
