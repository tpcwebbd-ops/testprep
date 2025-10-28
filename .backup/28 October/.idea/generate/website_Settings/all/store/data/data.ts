

    import { DateRange } from 'react-day-picker'

export interface IWebsite_Settings {
    "Name": string;
    "logourl": string;
    "description": string;
    "short description": string;
    "mobileNumber": string;
    "address": string;
    "menu": string;
    "footer": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultWebsite_Settings = {
    "Name": '',
    "logourl": '',
    "description": '',
    "short description": '',
    "mobileNumber": '',
    "address": '',
    "menu": '',
    "footer": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
