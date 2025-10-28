

    import { DateRange } from 'react-day-picker'

export interface IRewards {
    "user_id": string;
    "user_Name": string;
    "given_by_id": string;
    "given_by_Name": string;
    "reward_date": Date;
    "reward_time": string;
    "reason": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultRewards = {
    "user_id": '',
    "user_Name": '',
    "given_by_id": '',
    "given_by_Name": '',
    "reward_date": new Date(),
    "reward_time": '',
    "reason": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
