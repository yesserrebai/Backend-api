import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  tag?: object;
  reply?: mongoose.Types.ObjectId;
  likes?: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  postUserId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("comment", commentSchema);

export default Comment;
