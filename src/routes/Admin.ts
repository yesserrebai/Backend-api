import express from "express";
import auth from '../middleware/isLogged';
import { adminLogin, deleteSpamPost, getSpamPosts, getTotalComments, getTotalLikes, getTotalPosts, getTotalSpamPosts, getTotalUsers, registerAdmin, registerSuperadmin } from "../controllers/adminController";


const router = express.Router();

router.post('/create-admin',  registerAdmin)
router.post('/create-super-admin', registerSuperadmin)
router.post('/login', adminLogin)
router.get('/get_total_users' , auth, getTotalUsers);
router.get("/get_total_posts", auth, getTotalPosts);
router.get("/get_total_comments", auth, getTotalComments);
router.get("/get_total_likes", auth, getTotalLikes);
router.get("/get_total_spam_posts", auth, getTotalSpamPosts);
router.get("/get_spam_posts", auth, getSpamPosts);
router.delete("/delete_spam_posts/:id", auth, deleteSpamPost);

export default router;