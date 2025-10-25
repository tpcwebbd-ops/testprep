
import { DateRange } from 'react-day-picker'
import { StringArrayData } from '../../components/others-field-type/types'

export interface IPosts {
    "title": string;
    "email": string;
    "password": string;
    "passcode": string;
    "area": string;
    "sub-area": string[];
    "products-images": string[];
    "personal-image": string;
    "description": string;
    "age": number;
    "amount": number;
    "isActive": boolean;
    "start-date": Date;
    "start-time": string;
    "schedule-date": { from: Date; to: Date };
    "schedule-time": { start: string; end: string };
    "favorite-color": string;
    "number": string;
    "profile": string;
    "test": string;
    "info": string;
    "shift": string;
    "policy": boolean;
    "hobbies": string[];
    "ideas": string[];
    "students": StringArrayData[];
    "complexValue": {
        "id": string;
        "title": string;
        "parent": {
            "id": string;
            "title": string;
            "child": {
                "id": string;
                "title": string;
                "child": string;
                "note": string
            };
            "note": string
        };
        "note": string
    };
    createdAt: Date;
    updatedAt: Date;
    _id?: string;
}

export const defaultPosts = {
    "title": '',
    "email": '',
    "password": '',
    "passcode": '',
    "area": '',
    "sub-area": [],
    "products-images": [],
    "personal-image": '',
    "description": '',
    "age": 0,
    "amount": 0,
    "isActive": false,
    "start-date": new Date(),
    "start-time": '',
    "schedule-date": { from: new Date(), to: new Date() },
    "schedule-time": { start: "", end: "" },
    "favorite-color": '',
    "number": '',
    "profile": '',
    "test": '',
    "info": '',
    "shift": '',
    "policy": false,
    "hobbies": [],
    "ideas": [],
    "students": [],
    "complexValue": {
        "id": '',
        "title": '',
        "parent": {
            "id": '',
            "title": '',
            "child": {
                "id": '',
                "title": '',
                "child": '',
                "note": ''
            },
            "note": ''
        },
        "note": ''
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
