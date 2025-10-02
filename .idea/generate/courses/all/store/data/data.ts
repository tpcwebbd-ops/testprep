

    import { DateRange } from 'react-day-picker'

export interface ICourses {
    "title": string;
    "description": string;
    "duration_months": number;
    "total_lectures": number;
    "is_published": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultCourses = {
    "title": '',
    "description": '',
    "duration_months": 0,
    "total_lectures": 0,
    "is_published": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
