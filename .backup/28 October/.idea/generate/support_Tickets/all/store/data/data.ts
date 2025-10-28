

    import { DateRange } from 'react-day-picker'

export interface ISupport_Tickets {
    "student_id": string;
    "assigned_to_id ": string;
    "title": string;
    "description": string;
    "created_at": string;
    "closed_at": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultSupport_Tickets = {
    "student_id": '',
    "assigned_to_id ": '',
    "title": '',
    "description": '',
    "created_at": '',
    "closed_at": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
