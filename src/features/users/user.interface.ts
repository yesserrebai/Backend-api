import mongoose, { Document } from 'mongoose';

export default interface IUser extends Document {
  email: string;
  password?: string;
  role: string;
  firstname: string;
  lastname: string;
  gender: string;
  country: string;
  city: string;
  postalcode: string;
  phonenumber: string;
  language: string;
  dateofbirth: Date;
  avatar: string;
}
