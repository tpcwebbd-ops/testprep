

    import { DateRange } from 'react-day-picker'

export interface ISubmissions {
    "assessment_id": string;
    "student_id ": string;
    "submission_time": string;
    "submitted_content": string;
    "marks_obtained": number;
    "feedback": string;
    "checked_by_mentor_id": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultSubmissions = {
    "assessment_id": '',
    "student_id ": '',
    "submission_time": '',
    "submitted_content": '',
    "marks_obtained": 0,
    "feedback": '',
    "checked_by_mentor_id": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
