

    import { DateRange } from 'react-day-picker'

export interface IUsers {
    "full_name": string;
    "uid": string;
    "email": string;
    "password_hash": string;
    "phone_number": string;
    "profile_image_url": string;
    "sign_up_by": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultUsers = {
    "full_name": '',
    "uid": '',
    "email": '',
    "password_hash": '',
    "phone_number": '',
    "profile_image_url": '',
    "sign_up_by": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
