

    import { DateRange } from 'react-day-picker'

export interface ICompany_Goals {
    "title": string;
    "description": string;
    "set_by_user_id": string;
    "start_date": Date;
    "end_date": Date;
    "status": string;
    "notes": string;
    "checked_by_user_id": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultCompany_Goals = {
    "title": '',
    "description": '',
    "set_by_user_id": '',
    "start_date": new Date(),
    "end_date": new Date(),
    "status": '',
    "notes": '',
    "checked_by_user_id": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
