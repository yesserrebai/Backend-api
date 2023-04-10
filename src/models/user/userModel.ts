import mongoose from "mongoose";
import validator from "validator";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      default: "user",
    },

    firstname: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    gender: {
      type: String,
      default: "Male",
    },
    usertype: {
      type: String,
      default: "user",
    },
    country: {
      type: String,
      // required:[true,"A country is required"]
    },

    city: {
      type: String,
      // required: [true,"A city is required"]
    },
    postalcode: {
      type: String,
    },
    phonenumber: {
      type: String,
    },

    language: {
      type: String,
      default: "EN",
    },
    dateofbirth: {
      type: Date,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: "post",
      },
    ],
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//Compare if the password is correct
userSchema.methods.correctPassword = async function (
  enteredPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const User = mongoose.model<IUser>("user", userSchema);

export default User;
