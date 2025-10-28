

    import { DateRange } from 'react-day-picker'

export interface IMedia_s {
    "uploader_email": string;
    "file_name": string;
    "file_url": string;
    "file_type": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultMedia_s = {
    "uploader_email": '',
    "file_name": '',
    "file_url": '',
    "file_type": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
