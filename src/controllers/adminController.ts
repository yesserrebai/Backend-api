import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"
import { createAccessToken, createRefreshToken  } from "./services";
import { Generatesignature, GenerateSalt, GeneratePassword } from "../utils/utility";
import User from "../models/user/userModel";
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
  