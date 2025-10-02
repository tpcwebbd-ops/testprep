

    import { DateRange } from 'react-day-picker'

export interface IProfiles {
    "user_id": string;
    "address": string;
    "bio": string;
    "social_links": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultProfiles = {
    "user_id": '',
    "address": '',
    "bio": '',
    "social_links": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
