

    import { DateRange } from 'react-day-picker'

export interface IRoles_Management_s {
    "users_id": string;
    "role_ids": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultRoles_Management_s = {
    "users_id": '',
    "role_ids": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
