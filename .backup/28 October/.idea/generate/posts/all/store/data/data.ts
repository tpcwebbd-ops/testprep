

    import { DateRange } from 'react-day-picker'

export interface IPosts {
    "author_id": string;
    "title": string;
    "content": string;
    "published_date": Date;
    "published_time": string;
    "checked_by_user_id": string;
    "post_type": string;
    "publish_media": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPosts = {
    "author_id": '',
    "title": '',
    "content": '',
    "published_date": new Date(),
    "published_time": '',
    "checked_by_user_id": '',
    "post_type": '',
    "publish_media": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
