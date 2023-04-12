import * as jwt from "jsonwebtoken";
import { UserPayload } from "../typings";

export const createAccessToken = (payload: UserPayload) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWTEXPIRES_IN,
  });
};

export const createRefreshToken = (payload: UserPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
