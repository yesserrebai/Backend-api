import express from "express";
import { createNotify, deleteAllNotifies, getNotifies, isReadNotify, removeNotify } from "../controllers/notifyController";
import auth from '../middleware/isLogged';

const router = express.Router();

router.post('/notify', auth, createNotify);

router.delete('/notify/:id', auth, removeNotify);

router.get("/notifies", auth, getNotifies);

router.patch("/isReadNotify/:id", auth, isReadNotify);

router.delete("/deleteAllNotify", auth, deleteAllNotifies);



export default router;