import express from "express"
import {register,login, adminlogin,resetPasswordRequestController,resetPasswordController}  from "../controllers/auth"
const UserRouter = express.Router()

UserRouter.post("/register",register)
UserRouter.post("/login",login)

UserRouter.post("/adminlogin",adminlogin)
UserRouter.post("/resetPasswordRequest",resetPasswordRequestController)
UserRouter.post("/resetPassword",resetPasswordController)

export default UserRouter