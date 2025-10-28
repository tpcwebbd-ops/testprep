

    import { DateRange } from 'react-day-picker'

export interface IMessages {
    "sender_mobilenumber": string;
    "sender_Name": string;
    "message_content": string;
    "sent_time": string;
    "sent_date": Date;
    "is_read": string;
    "replayBy": string;
    "replayTime": string;
    "replayDate": Date;
    "isAddTomarkeking": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultMessages = {
    "sender_mobilenumber": '',
    "sender_Name": '',
    "message_content": '',
    "sent_time": '',
    "sent_date": new Date(),
    "is_read": '',
    "replayBy": '',
    "replayTime": '',
    "replayDate": new Date(),
    "isAddTomarkeking": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
