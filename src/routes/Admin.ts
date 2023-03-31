import express from "express";
// import {auth} from '../middleware/isLogged';
import { adminLogin, registerAdmin, registerSuperadmin } from "../controllers/adminController";


const router = express.Router();

router.post('/create-admin',  registerAdmin)
router.post('/create-super-admin', registerSuperadmin)
router.post('/login', adminLogin)

export default router;