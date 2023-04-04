import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text?: string;
  media?: string[];
}

const messageSchema: Schema = new Schema(
  {
    conversation: { type: Types.ObjectId, ref: "conversation" },
    sender: { type: Types.ObjectId, ref: "user" },
    recipient: { type: Types.ObjectId, ref: "user" },
    text: String,
    media: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>("message", messageSchema);
