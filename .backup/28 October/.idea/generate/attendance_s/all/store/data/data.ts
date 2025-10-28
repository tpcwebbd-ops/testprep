

    import { DateRange } from 'react-day-picker'

export interface IAttendance_s {
    "user_id": string;
    "date": Date;
    "time": string;
    "notes": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultAttendance_s = {
    "user_id": '',
    "date": new Date(),
    "time": '',
    "notes": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
