import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String, required: true },
    "books": { type: String, required: true }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)

export interface IPosts {
    "title": string;
    "books": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPosts = {
    "title": '',
    "books": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
