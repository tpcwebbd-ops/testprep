import mongoose, { Schema } from 'mongoose'

const rewardSchema = new Schema({
    "user_id": { type: String, },
    "user_Name": { type: String, },
    "given_by_id": { type: String, },
    "given_by_Name": { type: String, },
    "reward_date": { type: Date, default: Date.now },
    "reward_time": { type: String },
    "reason": { type: String, trim: true }
}, { timestamps: true })

export default mongoose.models.Reward || mongoose.model('Reward', rewardSchema)
 
