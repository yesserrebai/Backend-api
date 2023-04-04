import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IConversation extends Document {
  recipients: Types.ObjectId[];
  text: string;
  media: any[];
}

const conversationSchema: Schema = new Schema(
  {
    recipients: [{ type: Types.ObjectId, ref: 'user' }],
    text: String,
    media: Array,
  },
  {
    timestamps: true,
  }
);

const Conversation: Model<IConversation> = mongoose.model<IConversation>(
  'conversation',
  conversationSchema
);

export default Conversation;
