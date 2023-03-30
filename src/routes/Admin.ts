import express from "express";
import {auth} from '../middleware/isLogged';
import { registerAdmin, registerSuperadmin } from "../controllers/adminController";


const router = express.Router();

router.post('/create-admin',  registerAdmin)
router.post('/create-super-admin', registerSuperadmin)

export default router;