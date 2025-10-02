

    import { DateRange } from 'react-day-picker'

export interface IEmployee_Tasks {
    "title": string;
    "description": string;
    "assigned_to_id": string;
    "assigned_by_id": string;
    "start_time": string;
    "end_time": string;
    "start_date": Date;
    "end_date": Date;
    "status": string;
    "checked_by_id": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultEmployee_Tasks = {
    "title": '',
    "description": '',
    "assigned_to_id": '',
    "assigned_by_id": '',
    "start_time": '',
    "end_time": '',
    "start_date": new Date(),
    "end_date": new Date(),
    "status": '',
    "checked_by_id": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
