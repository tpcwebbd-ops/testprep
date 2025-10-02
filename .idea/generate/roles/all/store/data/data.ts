

    import { DateRange } from 'react-day-picker'

export interface IRoles {
    "role_name": string;
    "description": string;
    "assign_access": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultRoles = {
    "role_name": '',
    "description": '',
    "assign_access": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
