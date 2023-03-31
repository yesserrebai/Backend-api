import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    email: string;
    password: string;
    role: string;
    firstname: string;
    lastname: string;
    gender: string;
    usertype: string;
    country: string;
    city: string;
    postalcode: string;
    phonenumber: string;
    language: string;
    dateofbirth: Date;
    avatar: string;
    saved: mongoose.Types.ObjectId[];
    story: string;
    website: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
    correctPassword(enteredPassword: string, userPassword: string): Promise<boolean>;
  }