import { Request, Response } from "express";
import Notifies, { INotify } from "../models/notify/notify";

interface ICreateNotifyRequest extends Request {
  user: { _id: string };
  body: {
    id: string;
    recipients: string[];
    url: string;
    text: string;
    content: string;
    image: string;
  };
}


  export const createNotify = async (req: ICreateNotifyRequest, res: Response) => {
    try {
      const { id, recipients, url, text, content, image } = req.body;

      if (recipients.includes(req.user._id.toString())) return;

      const notify: INotify = new Notifies({
        id,
        recipients,
        url,
        text,
        content,
        image,
        user: req.user._id,
      });

      await notify.save();
      return res.json({ notify });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  export const removeNotify = async (req: Request, res: Response) => {
    try {
      const notify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });
      return res.json({ notify });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  export const getNotifies =async (req: Request, res: Response) => {
    try {
      const notifies: INotify[] = await Notifies.find({ recipients: req.user._id })
        .sort("-createdAt")
        .populate("user", "avatar username");

      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  export const isReadNotify = async (req: Request, res: Response) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        { _id: req.params.id },
        {
          isRead: true,
        }
      );

      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  export const deleteAllNotifies= async (req: Request, res: Response) => {
    try {
      const notifies = await Notifies.deleteMany({ recipients: req.user._id });

      return res.json({ notifies });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
