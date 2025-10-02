

    import { DateRange } from 'react-day-picker'

export interface IFollow_Ups {
    "lead_id": string;
    "followed_by_id": string;
    "follow_up_date": Date;
    "follow_up_time": string;
    "response_note": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultFollow_Ups = {
    "lead_id": '',
    "followed_by_id": '',
    "follow_up_date": new Date(),
    "follow_up_time": '',
    "response_note": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
