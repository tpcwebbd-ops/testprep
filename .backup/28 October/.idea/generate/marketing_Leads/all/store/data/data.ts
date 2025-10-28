

    import { DateRange } from 'react-day-picker'

export interface IMarketing_Leads {
    "full_name": string;
    "phone_number": string;
    "email": string;
    "source_content": string;
    "collected_by": string;
    "notes": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultMarketing_Leads = {
    "full_name": '',
    "phone_number": '',
    "email": '',
    "source_content": '',
    "collected_by": '',
    "notes": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
