import { Request, Response } from "express";
import Conversations, {
  IConversation,
} from "../models/Conversation/conversatonModel";
import Messages, { IMessage } from "../models/message/messageModel";

class APIfeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

interface IMessageRequest extends Request {
  user: { _id: string };
  params: { id: string };
}

interface IMessageResponse extends Response {
  json: (body?: any) => this;
}

interface IMessageCtrl {
  createMessage: (
    req: IMessageRequest,
    res: IMessageResponse
  ) => Promise<IMessageResponse>;
  getConversations: (
    req: IMessageRequest,
    res: IMessageResponse
  ) => Promise<IMessageResponse>;
  getMessages: (
    req: IMessageRequest,
    res: IMessageResponse
  ) => Promise<IMessageResponse>;
}

const messageCtrl: IMessageCtrl = {
  createMessage: async (req: IMessageRequest, res: IMessageResponse) => {
    try {
      const { recipient, text, media } = req.body;
      if (!recipient || (!text.trim() && media.length === 0))
        return res.json({ msg: "Nothing to send." });

      const newConversation: IConversation =
        await Conversations.findOneAndUpdate(
          {
            $or: [
              { recipients: [req.user._id, recipient] },
              { recipients: [recipient, req.user._id] },
            ],
          },
          {
            recipients: [req.user._id, recipient],
            text,
            media,
          },
          { new: true, upsert: true }
        );

      const newMessage: IMessage = new Messages({
        conversation: newConversation._id,
        sender: req.user._id,
        recipient,
        text,
        media,
      });

      await newMessage.save();

      res.json({ msg: "Created." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getConversations: async (req: IMessageRequest, res: IMessageResponse) => {
    try {
      const features = new APIfeatures(
        Conversations.find({
          recipients: req.user._id,
        }),
        req.query
      ).paginating();

      const conversations: IConversation[] = await features.query
        .sort("-updatedAt")
        .populate("recipients", "avatar username fullname");

      res.json({
        conversations,
        result: conversations.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getMessages: async (req: IMessageRequest, res: IMessageResponse) => {
    try {
      const features = new APIfeatures(
        Messages.find({
          $or: [
            { sender: req.user._id, recipient: req.params.id },
            { sender: req.params.id, recipient: req.user._id },
          ],
        }),
        req.query
      ).paginating();

      const messages: IMessage[] = await features.query.sort("-createdAt");

      res.json({
        messages,
        result: messages.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default messageCtrl;
