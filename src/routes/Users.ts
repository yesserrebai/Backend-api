import express from "express"
import {register,login}  from "../controllers/userController"
const UserRouter = express.Router()

UserRouter.post("/register",register)
UserRouter.post("/login",login)



export default UserRouter