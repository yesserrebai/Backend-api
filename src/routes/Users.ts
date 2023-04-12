import express from "express";
import auth from "../middleware/isLogged";
import { register, login, updateUser } from "../controllers/userController";
const UserRouter = express.Router();

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.put("/update-user", auth, updateUser);

export default UserRouter;
