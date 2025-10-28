

    import { DateRange } from 'react-day-picker'

export interface IReviews {
    "course_id": string;
    "user_id": string;
    "rating": number;
    "review_text": string;
    "created_at": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultReviews = {
    "course_id": '',
    "user_id": '',
    "rating": 0,
    "review_text": '',
    "created_at": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
