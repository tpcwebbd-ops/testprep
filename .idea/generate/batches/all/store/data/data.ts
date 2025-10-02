

    import { DateRange } from 'react-day-picker'

export interface IBatches {
    "batch_title": string;
    "course_id": string;
    "start_date": Date;
    "end_date": Date;
    "status": string;
    "instructors_user_id": string;
    "instructors_name": string;
    "enroll_students": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultBatches = {
    "batch_title": '',
    "course_id": '',
    "start_date": new Date(),
    "end_date": new Date(),
    "status": '',
    "instructors_user_id": '',
    "instructors_name": '',
    "enroll_students": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
