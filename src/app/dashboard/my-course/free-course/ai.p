look at the page.tsx ``` 

'use client';
import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';

/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, February, 2026
|-----------------------------------------
*/
const Page = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: '' });
  const completeContent = [
    {
      courseId: '693a985355fe2dff9a139193',
      completeContent: [
        { contentId: 'video-video-uid-1-1766560822726', isComplete: true },
        { contentId: 'Videos-video-uid-1-1766664024187', isComplete: true },
        { contentId: 'Assignments-assignment-uid-1-1771313648025', isComplete: false },
      ],
      isComplete: false,
    },
    {
      courseId: '694d1068812e4d5acaff47e5',
      completeContent: [],
      isComplete: false,
    },
  ];

  console.log('coursesData', coursesData);
  return <main>Page</main>;
};
export default Page;

```  and here is example of coursesData.courses = ``` [
    {
        "_id": "693a985355fe2dff9a139193",
        "courseName": "free-course",
        "courseDay": "Day 01",
        "isActive": true,
        "content": [
            {
                "id": "video-video-uid-1-1766560822726",
                "key": "video-uid-1",
                "name": "Video video-uid-1",
                "type": "video",
                "heading": "Video: video uid 1",
                "data": {
                    "uid": "video-uid-1",
                    "name": "Video 1",
                    "url": ",
                    "description": "This is the first video",
                    "duration": 60,
                    "startDate": "2023-01-01T00:00:00.000Z",
                    "endDate": "2023-01-02T00:00:00.000Z"
                }
            },
            {
                "id": "Videos-video-uid-1-1766664024187",
                "key": "video-uid-1",
                "name": "Videos video-uid-1",
                "type": "Videos",
                "heading": "Videos: video uid 1",
                "data": {
                    "uid": "video-uid-1",
                    "name": "Video 1",
                    "url": "https://utfs.io/f/dOs5X2bT3NyARqF1F3a3pN65JPYXMGaLKZcuqFAVB2d01DUO",
                    "description": "This is the first video",
                    "duration": 60,
                    "startDate": "2023-01-01T00:00:00.000Z",
                    "endDate": "2023-01-02T00:00:00.000Z"
                }
            },
            {
                "id": "Assignments-assignment-uid-1-1771313648025",
                "key": "assignment-uid-1",
                "name": "Assignments assignment-uid-1",
                "type": "Assignments",
                "heading": "Assignments: assignment uid 1",
                "data": {
                    "0": {
                        "uid": "assign-ielts-001",
                        "name": "IELTS Reading: Environmental Impacts",
                        "description": "Read the passage regarding climate change and answer the multiple-choice questions to test your comprehension skills.",
                        "totalMarks": 10,
                        "startDate": "2023-10-01T03:00:00.000Z",
                        "endDate": "2023-10-05T17:59:00.000Z",
                        "courseName": "IELTS Academic Prep",
                        "courseClass": "Batch A-24",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "What is the primary cause of rising sea levels mentioned in the text?",
                                "options": [
                                    "Thermal expansion",
                                    "Heavy rainfall",
                                    "Tectonic movements",
                                    "Solar flares"
                                ],
                                "correctAnswer": "Thermal expansion"
                            },
                            {
                                "id": "q2",
                                "question": "According to the author, which sector contributes most to carbon emissions?",
                                "options": [
                                    "Agriculture",
                                    "Transportation",
                                    "Energy production",
                                    "Manufacturing"
                                ],
                                "correctAnswer": "Energy production"
                            }
                        ]
                    },
                    "1": {
                        "uid": "assign-grammar-002",
                        "name": "Advanced Grammar: Conditionals",
                        "description": "A quiz designed to test your mastery of Zero, First, Second, and Third conditionals in complex sentences.",
                        "totalMarks": 20,
                        "startDate": "2023-10-02T04:00:00.000Z",
                        "endDate": "2023-10-04T12:00:00.000Z",
                        "courseName": "English Grammar 101",
                        "courseClass": "Intermediate Group",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Select the correct form: If I ___ you, I would accept the offer.",
                                "options": [
                                    "was",
                                    "were",
                                    "am",
                                    "have been"
                                ],
                                "correctAnswer": "were"
                            },
                            {
                                "id": "q2",
                                "question": "Complete: Had she known about the traffic, she ___ left earlier.",
                                "options": [
                                    "would have",
                                    "will have",
                                    "would",
                                    "had"
                                ],
                                "correctAnswer": "would have"
                            }
                        ]
                    },
                    "2": {
                        "uid": "assign-vocab-003",
                        "name": "Academic Vocabulary List 1",
                        "description": "Identify synonyms and correct usage of high-frequency academic words used in IELTS Writing Task 2.",
                        "totalMarks": 15,
                        "startDate": "2023-10-06T02:00:00.000Z",
                        "endDate": "2023-10-08T16:00:00.000Z",
                        "courseName": "Vocabulary Builder",
                        "courseClass": "All Batches",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Choose the best synonym for \"Ameliorate\".",
                                "options": [
                                    "Worsen",
                                    "Improve",
                                    "Calculate",
                                    "Ignore"
                                ],
                                "correctAnswer": "Improve"
                            },
                            {
                                "id": "q2",
                                "question": "Which word best fits: The government implemented a new ___ to boost the economy.",
                                "options": [
                                    "paradigm",
                                    "strategy",
                                    "hypothesis",
                                    "analysis"
                                ],
                                "correctAnswer": "strategy"
                            }
                        ]
                    },
                    "3": {
                        "uid": "assign-listen-004",
                        "name": "Listening Section 1: Form Filling",
                        "description": "Listen to the conversation between a hotel receptionist and a guest. Fill in the missing details regarding the booking.",
                        "totalMarks": 10,
                        "startDate": "2023-10-07T03:00:00.000Z",
                        "endDate": "2023-10-07T05:00:00.000Z",
                        "courseName": "IELTS Intensive",
                        "courseClass": "Weekend Batch",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "What is the guest's arrival date?",
                                "options": [
                                    "12th March",
                                    "21st March",
                                    "2nd March",
                                    "22nd March"
                                ],
                                "correctAnswer": "21st March"
                            },
                            {
                                "id": "q2",
                                "question": "How much is the deposit fee?",
                                "options": [
                                    "$50",
                                    "$15",
                                    "$55",
                                    "$500"
                                ],
                                "correctAnswer": "$50"
                            }
                        ]
                    },
                    "4": {
                        "uid": "assign-math-005",
                        "name": "Quantitative Reasoning: Algebra",
                        "description": "Solve the following linear and quadratic equations. Time limit is strict for this assignment.",
                        "totalMarks": 50,
                        "startDate": "2023-10-10T08:00:00.000Z",
                        "endDate": "2023-10-12T08:00:00.000Z",
                        "courseName": "General GRE Prep",
                        "courseClass": "Math Squad",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Solve for x: 2x + 5 = 15",
                                "options": [
                                    "5",
                                    "10",
                                    "2.5",
                                    "7.5"
                                ],
                                "correctAnswer": "5"
                            },
                            {
                                "id": "q2",
                                "question": "What is the value of x if x^2 - 9 = 0 and x > 0?",
                                "options": [
                                    "3",
                                    "-3",
                                    "9",
                                    "81"
                                ],
                                "correctAnswer": "3"
                            }
                        ]
                    },
                    "5": {
                        "uid": "assign-write-006",
                        "name": "Writing Task 1: Bar Charts",
                        "description": "Analyze the structure of a report describing a bar chart. Identify the correct overview statement.",
                        "totalMarks": 20,
                        "startDate": "2023-10-15T03:00:00.000Z",
                        "endDate": "2023-10-20T17:59:00.000Z",
                        "courseName": "IELTS Academic Prep",
                        "courseClass": "Batch B-12",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Which sentence serves as the best Overview?",
                                "options": [
                                    "The chart shows that 50% of people like coffee.",
                                    "Overall, coffee consumption increased while tea consumption remained stable.",
                                    "In 1990, coffee was 20 dollars.",
                                    "The x-axis represents the years from 1990 to 2000."
                                ],
                                "correctAnswer": "Overall, coffee consumption increased while tea consumption remained stable."
                            }
                        ]
                    },
                    "6": {
                        "uid": "assign-speak-007",
                        "name": "Speaking Part 2: Cue Card Theory",
                        "description": "Test your understanding of how to structure your 2-minute speech for Part 2.",
                        "totalMarks": 10,
                        "startDate": "2023-10-11T04:00:00.000Z",
                        "endDate": "2023-10-11T14:00:00.000Z",
                        "courseName": "Spoken English Pro",
                        "courseClass": "Evening Shift",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "How much time do you get to prepare notes before speaking?",
                                "options": [
                                    "30 seconds",
                                    "1 minute",
                                    "2 minutes",
                                    "5 minutes"
                                ],
                                "correctAnswer": "1 minute"
                            },
                            {
                                "id": "q2",
                                "question": "Should you stop speaking before the examiner interrupts you?",
                                "options": [
                                    "Yes, keep it short",
                                    "No, keep speaking until stopped",
                                    "Yes, exactly at 1 minute",
                                    "No, speak for 5 minutes"
                                ],
                                "correctAnswer": "No, keep speaking until stopped"
                            }
                        ]
                    },
                    "7": {
                        "uid": "assign-sci-008",
                        "name": "General Science: Biology Basics",
                        "description": "A fundamental quiz on cell structure and functions for GED preparation.",
                        "totalMarks": 25,
                        "startDate": "2023-10-18T02:00:00.000Z",
                        "endDate": "2023-10-25T10:00:00.000Z",
                        "courseName": "GED Prep",
                        "courseClass": "Science Group",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Which organelle is known as the powerhouse of the cell?",
                                "options": [
                                    "Nucleus",
                                    "Ribosome",
                                    "Mitochondria",
                                    "Golgi Apparatus"
                                ],
                                "correctAnswer": "Mitochondria"
                            },
                            {
                                "id": "q2",
                                "question": "What is the process by which plants make food?",
                                "options": [
                                    "Respiration",
                                    "Photosynthesis",
                                    "Digestion",
                                    "Fermentation"
                                ],
                                "correctAnswer": "Photosynthesis"
                            }
                        ]
                    },
                    "8": {
                        "uid": "assign-gen-009",
                        "name": "IELTS General: Letter Writing",
                        "description": "Understand the difference between Formal, Semi-formal, and Informal letters.",
                        "totalMarks": 15,
                        "startDate": "2023-11-01T03:00:00.000Z",
                        "endDate": "2023-11-03T17:59:00.000Z",
                        "courseName": "IELTS General Training",
                        "courseClass": "GT-05",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "Which salutation is appropriate for a formal letter where the name is unknown?",
                                "options": [
                                    "Dear John,",
                                    "Dear Sir/Madam,",
                                    "Hi There,",
                                    "Dear Mr. Smith,"
                                ],
                                "correctAnswer": "Dear Sir/Madam,"
                            },
                            {
                                "id": "q2",
                                "question": "How should you sign off a formal letter starting with \"Dear Sir/Madam\"?",
                                "options": [
                                    "Yours sincerely,",
                                    "Best regards,",
                                    "Yours faithfully,",
                                    "Love,"
                                ],
                                "correctAnswer": "Yours faithfully,"
                            }
                        ]
                    },
                    "9": {
                        "uid": "assign-hist-010",
                        "name": "Modern History: World War II",
                        "description": "Timeline and key events analysis of the Second World War.",
                        "totalMarks": 30,
                        "startDate": "2023-10-20T06:00:00.000Z",
                        "endDate": "2023-10-30T06:00:00.000Z",
                        "courseName": "History 101",
                        "courseClass": "Humanities",
                        "questions": [
                            {
                                "id": "q1",
                                "question": "In which year did World War II end?",
                                "options": [
                                    "1944",
                                    "1945",
                                    "1939",
                                    "1950"
                                ],
                                "correctAnswer": "1945"
                            },
                            {
                                "id": "q2",
                                "question": "Which event triggered the start of the war?",
                                "options": [
                                    "Attack on Pearl Harbor",
                                    "Invasion of Poland",
                                    "D-Day",
                                    "Bombing of London"
                                ],
                                "correctAnswer": "Invasion of Poland"
                            }
                        ]
                    },
                    "uid": "",
                    "name": "Assignment 1",
                    "description": "description of assignment ",
                    "totalMarks": 2,
                    "startDate": "2026-02-18T16:37:00.000Z",
                    "endDate": "2026-02-19T04:38:00.000Z",
                    "courseName": "Free Course",
                    "courseClass": "Batch 1",
                    "questions": [
                        {
                            "id": "q-1771313712752",
                            "question": "Question 1",
                            "options": [
                                "Option 1",
                                "Option 2",
                                "Option 3",
                                "Option 4"
                            ],
                            "correctAnswer": ""
                        },
                        {
                            "id": "q-1771313778744",
                            "question": "Question 1",
                            "options": [
                                "Option 1",
                                "Option 1",
                                "Option 1",
                                "Option 1"
                            ],
                            "correctAnswer": "Option 1"
                        }
                    ]
                }
            }
        ],
        "createdAt": "2025-12-11T10:09:23.606Z",
        "updatedAt": "2026-02-17T07:37:43.566Z",
        "__v": 0
    },
    {
        "_id": "694d1068812e4d5acaff47e5",
        "courseName": "free-course",
        "courseDay": "Day 20",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-25T10:22:32.139Z",
        "updatedAt": "2025-12-27T12:58:40.758Z",
        "__v": 0
    },
    {
        "_id": "694fd7f8e99f28944d137d49",
        "courseName": "free-course",
        "courseDay": "Day 97",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-27T12:58:32.337Z",
        "updatedAt": "2025-12-27T12:58:32.337Z",
        "__v": 0
    },
    {
        "_id": "694d120d812e4d5acaff47fb",
        "courseName": "free-course",
        "courseDay": "Day 23",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-25T10:29:33.572Z",
        "updatedAt": "2025-12-25T10:29:33.572Z",
        "__v": 0
    },
    {
        "_id": "694b89a1fce0458effdb7bdf",
        "courseName": "free-course",
        "courseDay": "Day 16",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-24T06:35:13.171Z",
        "updatedAt": "2025-12-24T06:35:13.171Z",
        "__v": 0
    },
    {
        "_id": "694a73d09a791cd6666e8e6a",
        "courseName": "free-course",
        "courseDay": "Day 03",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-23T10:49:52.290Z",
        "updatedAt": "2025-12-23T10:49:52.290Z",
        "__v": 0
    },
    {
        "_id": "694a73c09a791cd6666e8e66",
        "courseName": "free-course",
        "courseDay": "Day 94",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-23T10:49:36.288Z",
        "updatedAt": "2025-12-23T10:49:36.288Z",
        "__v": 0
    },
    {
        "_id": "693a985755fe2dff9a139197",
        "courseName": "free-course",
        "courseDay": "Day 02",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-11T10:09:27.867Z",
        "updatedAt": "2025-12-11T10:09:27.867Z",
        "__v": 0
    },
    {
        "_id": "693a983a55fe2dff9a13918a",
        "courseName": "online-spoken",
        "courseDay": "Day 03",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-11T10:08:58.719Z",
        "updatedAt": "2025-12-11T10:08:58.719Z",
        "__v": 0
    },
    {
        "_id": "693a97fa55fe2dff9a139184",
        "courseName": "online-spoken",
        "courseDay": "Day 100",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-11T10:07:54.166Z",
        "updatedAt": "2025-12-11T10:07:54.166Z",
        "__v": 0
    },
    {
        "_id": "693a968955fe2dff9a139139",
        "courseName": "online-spoken",
        "courseDay": "Day 02",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-11T10:01:45.600Z",
        "updatedAt": "2025-12-11T10:01:45.600Z",
        "__v": 0
    },
    {
        "_id": "693a967d55fe2dff9a13912b",
        "courseName": "online-spoken",
        "courseDay": "Day 01",
        "isActive": true,
        "content": [],
        "createdAt": "2025-12-11T10:01:33.792Z",
        "updatedAt": "2025-12-11T10:01:33.792Z",
        "__v": 0
    }
]```    Now Your task is make a gaming UI with the following instructions. 

1. at the top there is a button named Day-1 [it comes from courseDay]. it is circle. 
2. compare with completeContent and render button status.
    - if complete then render with check mark.
    - if false then check previous courseId isComplete
        - if found true then make it click able. 
        - if found false then render disabled.
* it looks like game. students clear all path one by one. 
3. Make dotted line between each button. 
4. add animation on this page. 
5. If click a button then open a pop up window. 