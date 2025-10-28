

    import { DateRange } from 'react-day-picker'

export interface IAssessments {
    "batch_id": string;
    "lecture_id": string;
    "course_id": string;
    "title": string;
    "description": string;
    "start_time": string;
    "end_time": string;
    "start_date": Date;
    "end_date": Date;
    "total_marks": number;
    "marks_obtained": number;
    "assessment_sheet": string;
    "assesment_checked_by": string;
    "assesment_create_by": string;
    "assessment_type": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultAssessments = {
    "batch_id": '',
    "lecture_id": '',
    "course_id": '',
    "title": '',
    "description": '',
    "start_time": '',
    "end_time": '',
    "start_date": new Date(),
    "end_date": new Date(),
    "total_marks": 0,
    "marks_obtained": 0,
    "assessment_sheet": '',
    "assesment_checked_by": '',
    "assesment_create_by": '',
    "assessment_type": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
