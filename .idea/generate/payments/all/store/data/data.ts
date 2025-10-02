

    import { DateRange } from 'react-day-picker'

export interface IPayments {
    "payer_name": string;
    "payer_email": string;
    "payer_phone": string;
    "user_id": string;
    "amount": number;
    "transaction_id": string;
    "payment_method": string;
    "verified_by_id": string;
    "payment_date": Date;
    "payment_time": string;
    "send_by": string;
    "received_by": string;
    "payment_for": string;
    "status": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPayments = {
    "payer_name": '',
    "payer_email": '',
    "payer_phone": '',
    "user_id": '',
    "amount": 0,
    "transaction_id": '',
    "payment_method": '',
    "verified_by_id": '',
    "payment_date": new Date(),
    "payment_time": '',
    "send_by": '',
    "received_by": '',
    "payment_for": '',
    "status": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
