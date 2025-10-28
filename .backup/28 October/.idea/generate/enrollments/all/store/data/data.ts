

    import { DateRange } from 'react-day-picker'

export interface IEnrollments {
    "student_email  ": string;
    "batch_id": string;
    "enrollment_date": Date;
    "enrollment_time": string;
    "is_complete": string;
    "payment_id": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultEnrollments = {
    "student_email  ": '',
    "batch_id": '',
    "enrollment_date": new Date(),
    "enrollment_time": '',
    "is_complete": '',
    "payment_id": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
