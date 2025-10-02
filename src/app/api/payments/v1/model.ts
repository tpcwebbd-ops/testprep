import mongoose, { Schema } from 'mongoose'

const paymentSchema = new Schema({
    "payer_name": { type: String, },
    "payer_email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "payer_phone": {
                    type: String
                },
    "user_id": { type: String, },
    "amount": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "transaction_id": { type: String, },
    "payment_method": { type: String, },
    "verified_by_id": { type: String, },
    "payment_date": { type: Date, default: Date.now },
    "payment_time": { type: String },
    "send_by": { type: String, },
    "received_by": { type: String, },
    "payment_for": { type: String, enum: ['Course Enrollment', 'salary', 'commission', 'bonus', 'others'] },
    "status": { type: String, enum: ['Completed', 'Failed', 'Pending'] }
}, { timestamps: true })

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema)
 
