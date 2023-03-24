import mongoose from "mongoose";
import Token from "./token.inteface";
const tokenSchema = new mongoose.Schema<Token>({
  userId: {
    type: String,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,// this is the expiry time in seconds
  },
});
export default mongoose.model<Token>("token", tokenSchema);