import { Router } from 'express';
import  auth  from '../middleware/isLogged';
import {createPost, deletePost, getPost, getPostDiscover, getPosts, getSavePost, getUserPosts, likePost, reportPost, savePost, unLikePost, unSavePost, updatePost} from '../controllers/postController';

const router = Router();

router.route('/posts')
  .post(auth, createPost)
  .get(auth, getPosts);

router.route('/post/:id')
  .patch(auth, updatePost)
  .get(auth, getPost)
  .delete(auth, deletePost);

router.patch('/post/:id/like', auth, likePost);
router.patch('/post/:id/unlike', auth, unLikePost);

router.patch('/post/:id/report', auth, reportPost);

router.get('/user_posts/:id', auth, getUserPosts);

router.get('/post_discover', auth, getPostDiscover);

router.patch('/savePost/:id', auth, savePost);
router.patch('/unSavePost/:id', auth, unSavePost);
router.get('/getSavePosts', auth, getSavePost);

export default router;
