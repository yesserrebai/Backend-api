import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"
import { createAccessToken, createRefreshToken  } from "./services";
import { Generatesignature, GenerateSalt, GeneratePassword } from "../utils/utility";
import User from "../models/user/userModel";
import Post from "../models/post/postModel";
import Comment from "../models/comments/commentModel";
import {IUser} from "../models/user/user.interface"


export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin already exists' });
        }


        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password, salt);
        const newAdmin = new User({ email, password: hashedPassword });
        await newAdmin.save();

        let signature = await Generatesignature({
            email: newAdmin.email,
            role: newAdmin.role,
            id: newAdmin.id
        });

        res.status(201).json({ signature });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const registerSuperadmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingSuperadmin = await User.findOne({ email });
        if (existingSuperadmin) {
            return res.status(409).json({ message: 'Superadmin already exists' });
        }

        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password, salt);
        const newSuperadmin = new User({ email, password: hashedPassword });
        await newSuperadmin.save();

        let signature = await Generatesignature({
            email: newSuperadmin.email,
            role: newSuperadmin.role,
            id: newSuperadmin.id
        });

        res.status(201).json({ signature });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const adminLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
  
      const user: IUser = await User.findOne({ email, role: "admin" });
  
      if (!user) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Email or Password is incorrect." });
      }
      const access_token = createAccessToken({ id: user._id, email: user.email, role: user.role });
const refresh_token = createRefreshToken({ id: user._id, email: user.email, role: user.role });

  
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
      });
  
      const { password: _, ...userWithoutPassword } = user._doc;
  
      return res.json({
        msg: "Logged in Successfully!",
        access_token,
        user: userWithoutPassword,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };

  export const getTotalUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await User.find();
      const total_users = users.length;
      return res.json({ total_users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const getTotalPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await Post.find();
      const total_posts = posts.length;
      return res.json({ total_posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const getTotalComments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const comments = await Comment.find();
      const total_comments = comments.length;
      return res.json({ total_comments });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const getTotalLikes = async (req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await Post.find();
      let total_likes = 0;
      await posts.map((post) => (total_likes += post.likes.length));
      return res.json({ total_likes });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const getTotalSpamPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await Post.find();
      
      const reportedPosts = await posts.filter(post => post.reports.length>2);
      const total_spam_posts = reportedPosts.length;
      return res.json({ total_spam_posts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const getSpamPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await Post.find()
        .select("user createdAt reports content")
        .populate({ path: "user", select: "username avatar email" });
      const spamPosts = posts.filter((post) => post.reports.length > 1);
      
      return res.json({ spamPosts });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  export const deleteSpamPost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
      });
  
      await Comment.deleteMany({ _id: { $in: post.comments } });
  
      return res.json({ msg: "Post deleted successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  