

    import { DateRange } from 'react-day-picker'

export interface IContent_Resources {
    "lecture_id": string;
    "title": string;
    "url_or_content": string;
    "media_id": string;
    "content_type": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultContent_Resources = {
    "lecture_id": '',
    "title": '',
    "url_or_content": '',
    "media_id": '',
    "content_type": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
