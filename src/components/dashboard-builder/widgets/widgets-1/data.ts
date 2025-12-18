export interface IMockWidgets1 {
  uid: string;
  name: string;
  description: string;
  totalMarks: number;
  startDate: Date;
  endDate: Date;
  courseName: string;
  courseClass: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export const mockWidgets1: IMockWidgets1[] = [
  {
    uid: 'assign-ielts-001',
    name: 'IELTS Reading: Environmental Impacts',
    description: 'Read the passage regarding climate change and answer the multiple-choice questions to test your comprehension skills.',
    totalMarks: 10,
    startDate: new Date('2023-10-01T09:00:00'),
    endDate: new Date('2023-10-05T23:59:00'),
    courseName: 'IELTS Academic Prep',
    courseClass: 'Batch A-24',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary cause of rising sea levels mentioned in the text?',
        options: ['Thermal expansion', 'Heavy rainfall', 'Tectonic movements', 'Solar flares'],
        correctAnswer: 'Thermal expansion',
      },
      {
        id: 'q2',
        question: 'According to the author, which sector contributes most to carbon emissions?',
        options: ['Agriculture', 'Transportation', 'Energy production', 'Manufacturing'],
        correctAnswer: 'Energy production',
      },
    ],
  },
  {
    uid: 'assign-grammar-002',
    name: 'Advanced Grammar: Conditionals',
    description: 'A quiz designed to test your mastery of Zero, First, Second, and Third conditionals in complex sentences.',
    totalMarks: 20,
    startDate: new Date('2023-10-02T10:00:00'),
    endDate: new Date('2023-10-04T18:00:00'),
    courseName: 'English Grammar 101',
    courseClass: 'Intermediate Group',
    questions: [
      {
        id: 'q1',
        question: 'Select the correct form: If I ___ you, I would accept the offer.',
        options: ['was', 'were', 'am', 'have been'],
        correctAnswer: 'were',
      },
      {
        id: 'q2',
        question: 'Complete: Had she known about the traffic, she ___ left earlier.',
        options: ['would have', 'will have', 'would', 'had'],
        correctAnswer: 'would have',
      },
    ],
  },
  {
    uid: 'assign-vocab-003',
    name: 'Academic Vocabulary List 1',
    description: 'Identify synonyms and correct usage of high-frequency academic words used in IELTS Writing Task 2.',
    totalMarks: 15,
    startDate: new Date('2023-10-06T08:00:00'),
    endDate: new Date('2023-10-08T22:00:00'),
    courseName: 'Vocabulary Builder',
    courseClass: 'All Batches',
    questions: [
      {
        id: 'q1',
        question: 'Choose the best synonym for "Ameliorate".',
        options: ['Worsen', 'Improve', 'Calculate', 'Ignore'],
        correctAnswer: 'Improve',
      },
      {
        id: 'q2',
        question: 'Which word best fits: The government implemented a new ___ to boost the economy.',
        options: ['paradigm', 'strategy', 'hypothesis', 'analysis'],
        correctAnswer: 'strategy',
      },
    ],
  },
  {
    uid: 'assign-listen-004',
    name: 'Listening Section 1: Form Filling',
    description: 'Listen to the conversation between a hotel receptionist and a guest. Fill in the missing details regarding the booking.',
    totalMarks: 10,
    startDate: new Date('2023-10-07T09:00:00'),
    endDate: new Date('2023-10-07T11:00:00'),
    courseName: 'IELTS Intensive',
    courseClass: 'Weekend Batch',
    questions: [
      {
        id: 'q1',
        question: "What is the guest's arrival date?",
        options: ['12th March', '21st March', '2nd March', '22nd March'],
        correctAnswer: '21st March',
      },
      {
        id: 'q2',
        question: 'How much is the deposit fee?',
        options: ['$50', '$15', '$55', '$500'],
        correctAnswer: '$50',
      },
    ],
  },
  {
    uid: 'assign-math-005',
    name: 'Quantitative Reasoning: Algebra',
    description: 'Solve the following linear and quadratic equations. Time limit is strict for this assignment.',
    totalMarks: 50,
    startDate: new Date('2023-10-10T14:00:00'),
    endDate: new Date('2023-10-12T14:00:00'),
    courseName: 'General GRE Prep',
    courseClass: 'Math Squad',
    questions: [
      {
        id: 'q1',
        question: 'Solve for x: 2x + 5 = 15',
        options: ['5', '10', '2.5', '7.5'],
        correctAnswer: '5',
      },
      {
        id: 'q2',
        question: 'What is the value of x if x^2 - 9 = 0 and x > 0?',
        options: ['3', '-3', '9', '81'],
        correctAnswer: '3',
      },
    ],
  },
  {
    uid: 'assign-write-006',
    name: 'Writing Task 1: Bar Charts',
    description: 'Analyze the structure of a report describing a bar chart. Identify the correct overview statement.',
    totalMarks: 20,
    startDate: new Date('2023-10-15T09:00:00'),
    endDate: new Date('2023-10-20T23:59:00'),
    courseName: 'IELTS Academic Prep',
    courseClass: 'Batch B-12',
    questions: [
      {
        id: 'q1',
        question: 'Which sentence serves as the best Overview?',
        options: [
          'The chart shows that 50% of people like coffee.',
          'Overall, coffee consumption increased while tea consumption remained stable.',
          'In 1990, coffee was 20 dollars.',
          'The x-axis represents the years from 1990 to 2000.',
        ],
        correctAnswer: 'Overall, coffee consumption increased while tea consumption remained stable.',
      },
    ],
  },
  {
    uid: 'assign-speak-007',
    name: 'Speaking Part 2: Cue Card Theory',
    description: 'Test your understanding of how to structure your 2-minute speech for Part 2.',
    totalMarks: 10,
    startDate: new Date('2023-10-11T10:00:00'),
    endDate: new Date('2023-10-11T20:00:00'),
    courseName: 'Spoken English Pro',
    courseClass: 'Evening Shift',
    questions: [
      {
        id: 'q1',
        question: 'How much time do you get to prepare notes before speaking?',
        options: ['30 seconds', '1 minute', '2 minutes', '5 minutes'],
        correctAnswer: '1 minute',
      },
      {
        id: 'q2',
        question: 'Should you stop speaking before the examiner interrupts you?',
        options: ['Yes, keep it short', 'No, keep speaking until stopped', 'Yes, exactly at 1 minute', 'No, speak for 5 minutes'],
        correctAnswer: 'No, keep speaking until stopped',
      },
    ],
  },
  {
    uid: 'assign-sci-008',
    name: 'General Science: Biology Basics',
    description: 'A fundamental quiz on cell structure and functions for GED preparation.',
    totalMarks: 25,
    startDate: new Date('2023-10-18T08:00:00'),
    endDate: new Date('2023-10-25T16:00:00'),
    courseName: 'GED Prep',
    courseClass: 'Science Group',
    questions: [
      {
        id: 'q1',
        question: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
        correctAnswer: 'Mitochondria',
      },
      {
        id: 'q2',
        question: 'What is the process by which plants make food?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
        correctAnswer: 'Photosynthesis',
      },
    ],
  },
  {
    uid: 'assign-gen-009',
    name: 'IELTS General: Letter Writing',
    description: 'Understand the difference between Formal, Semi-formal, and Informal letters.',
    totalMarks: 15,
    startDate: new Date('2023-11-01T09:00:00'),
    endDate: new Date('2023-11-03T23:59:00'),
    courseName: 'IELTS General Training',
    courseClass: 'GT-05',
    questions: [
      {
        id: 'q1',
        question: 'Which salutation is appropriate for a formal letter where the name is unknown?',
        options: ['Dear John,', 'Dear Sir/Madam,', 'Hi There,', 'Dear Mr. Smith,'],
        correctAnswer: 'Dear Sir/Madam,',
      },
      {
        id: 'q2',
        question: 'How should you sign off a formal letter starting with "Dear Sir/Madam"?',
        options: ['Yours sincerely,', 'Best regards,', 'Yours faithfully,', 'Love,'],
        correctAnswer: 'Yours faithfully,',
      },
    ],
  },
  {
    uid: 'assign-hist-010',
    name: 'Modern History: World War II',
    description: 'Timeline and key events analysis of the Second World War.',
    totalMarks: 30,
    startDate: new Date('2023-10-20T12:00:00'),
    endDate: new Date('2023-10-30T12:00:00'),
    courseName: 'History 101',
    courseClass: 'Humanities',
    questions: [
      {
        id: 'q1',
        question: 'In which year did World War II end?',
        options: ['1944', '1945', '1939', '1950'],
        correctAnswer: '1945',
      },
      {
        id: 'q2',
        question: 'Which event triggered the start of the war?',
        options: ['Attack on Pearl Harbor', 'Invasion of Poland', 'D-Day', 'Bombing of London'],
        correctAnswer: 'Invasion of Poland',
      },
    ],
  },
];
