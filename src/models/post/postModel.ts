import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPost extends Document {
  content: string;
  images: string[];
  likes: string[];
  comments: string[];
  user: string;
  reports: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema = new Schema(
  {
    content: { type: String},
    images: { type: [String], required: true },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<IPost>("post", postSchema);

export default Post;
