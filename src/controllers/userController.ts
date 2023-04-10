import { Request, Response } from "express";
import User from "../models/user/userModel";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createAccessToken } from "./services";
import Joi from "joi";
import countries from "i18n-iso-countries";

// for now will keep it like this
interface CustomRequest extends Request {
  user?: any;
}
const isValidCountry = (
  value: any,
  helpers: { error: (arg0: string) => any }
) => {
  if (!value || typeof value !== "string") {
    return helpers.error("any.invalid");
  }

  const countryCode = countries.getAlpha2Code(value, "en");

  if (!countryCode) {
    return helpers.error("any.invalid");
  }

  return countryCode;
};

interface ID {
  id: string;
  user: any;
  statusCode: number;
  res: any;
  req: any;
  email: string;
  password: string;
}
// comment
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  usertype: Joi.string().valid("admin", "user").required(),
  country: Joi.string().custom(isValidCountry).required(),
  city: Joi.string().required(),
  postalcode: Joi.string().required(),
  language: Joi.string().valid("EN", "FR", "IT").required(),
  dateofbirth: Joi.date().required(),
});
const updateUserSchema = Joi.object({
  password: Joi.string().min(8),
  firstname: Joi.string(),
  lastname: Joi.string(),
  gender: Joi.string().valid("male", "female", "other"),
  usertype: Joi.string().valid("admin", "user"),
  country: Joi.string().custom(isValidCountry),
  city: Joi.string(),
  postalcode: Joi.string(),
  language: Joi.string().valid("EN", "FR", "IT"),
  dateofbirth: Joi.date(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstname,
      lastname,
      gender,
      usertype,
      country,
      city,
      postalcode,
      language,
      dateofbirth,
    } = req.body;

    const { error } = registrationSchema.validate({
      email,
      password,
      firstname,
      lastname,
      gender,
      usertype,
      country,
      city,
      postalcode,
      language,
      dateofbirth,
    });
    if (error && error.details) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
      });
    }

    //Check to see if email exist in the databse
    const user_email = await User.findOne({ email });
    if (user_email) {
      return res
        .status(400)
        .json({ message: "The email is already registerd" });
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the hashed password
    const registerUser = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      gender,
      usertype,
      country,
      city,
      postalcode,
      language,
      dateofbirth,
    });
    const access_token = createAccessToken({
      id: registerUser._id.toString(),
      email: registerUser.email,
      role: registerUser.role,
    });
    delete registerUser._doc["password"];
    res.status(200).json({
      status: "success",
      message: "Registration Successfully",
      access_token,
      user: {
        ...registerUser._doc,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "unknown",
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password can not be blank",
      });
    }

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email or Password is incorrect",
      });
    }
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Email or Password is incorrect",
      });
    }
    const access_token = createAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    console.log(access_token);

    res.status(200).json({
      status: "success",
      message: "You have been logged in!",
      access_token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {
    // console.log("hshhshshs", err);
    return res.status(500).json({
      status: "unknown",
      message: err.message,
    });
  }
};
export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const {
      password,
      firstname,
      lastname,
      gender,
      usertype,
      country,
      city,
      postalcode,
      language,
      dateofbirth,
    } = req.body;

    const { error } = updateUserSchema.validate({
      password,
      firstname,
      lastname,
      gender,
      usertype,
      country,
      city,
      postalcode,
      language,
      dateofbirth,
    });
    if (error && error.details) {
      return res.status(400).json({
        status: "failed",
        message: error.details[0].message,
      });
    }

    const authenticatedUser = req.user;
    const result = await User.findByIdAndUpdate(
      authenticatedUser._id,
      req.body
    );
    return res.status(200).send({ status: "success", message: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "unknown",
      message: error.message,
    });
  }
};
