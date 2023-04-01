import express from "express";
import { createComment, deleteComment, likeComment, unLikeComment, updateComment } from "../controllers/commentController";
import auth from '../middleware/isLogged';

const router = express.Router();


router.post('/comment', auth, createComment);

router.patch('/comment/:id', auth, updateComment);

router.patch("/comment/:id/like", auth, likeComment);
router.patch("/comment/:id/unlike", auth, unLikeComment);
router.delete("/comment/:id", auth, deleteComment);


export default router;