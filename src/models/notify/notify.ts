import mongoose, { Schema, Document } from "mongoose";

export interface INotify extends Document {
  user: mongoose.Types.ObjectId;
  recipients: mongoose.Types.ObjectId[];
  url: string;
  text: string;
  content: string;
  image: string;
  isRead: boolean;
}

const notifySchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    url: String,
    text: String,
    content: String,
    image: String,
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Notifies = mongoose.model<INotify>("notify", notifySchema);

export default Notifies;
