import express from "express"
import {register,login, adminlogin}  from "../controllers/auth"
const UserRouter = express.Router()

UserRouter.post("/register",register)
UserRouter.post("/login",login)

UserRouter.post("/adminlogin",adminlogin)

export default UserRouter