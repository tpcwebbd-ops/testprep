

    import { DateRange } from 'react-day-picker'

export interface IQ_and_A_s {
    "course_id": string;
    "lecture_id": string;
    "student_uid": string;
    "question_text": string;
    "question_time": string;
    "answer_text": string;
    "answered_by_user_id": string;
    "answer_time": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultQ_and_A_s = {
    "course_id": '',
    "lecture_id": '',
    "student_uid": '',
    "question_text": '',
    "question_time": '',
    "answer_text": '',
    "answered_by_user_id": '',
    "answer_time": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
