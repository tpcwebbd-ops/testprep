

    import { DateRange } from 'react-day-picker'

export interface ILectures {
    "module_id": string;
    "title": string;
    "description": string;
    "lecture_date": Date;
    "order_index": number;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultLectures = {
    "module_id": '',
    "title": '',
    "description": '',
    "lecture_date": new Date(),
    "order_index": 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
