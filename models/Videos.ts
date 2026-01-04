import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const

export interface IVideos {
    _id?: mongoose.Types.ObjectId;
    title: string;
    discription: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number
        width: number
        quality: Number
    }
    createdAt?: Date;
    updatedAt?: Date;

}

const videoSchema = new Schema<IVideos>({
    title: { type: String, required: true },
    discription: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, dafault: true },
    transformation: {

        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: {type:Number , min: 1 , max:100}
    }
  

} , {timestamps: true});

const Video =  models?.Video || model<IVideos>("Video" , videoSchema)

export default Video;