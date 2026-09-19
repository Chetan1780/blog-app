import express from 'express'
import { addBlog, allBlog, deleteBlog, editBlog, getBlog, getBlogBycategory, getPublicFeed, getRecentActivity, getRelatedBlog, recordView, search, showBlog, updateBlog } from '../Controllers/BlogController.js';
import upload from '../Config/multer.js';
import { authenticate, optionalAuthenticate } from '../Middleware/authenticate.js';

const BlogRoute = express.Router();

BlogRoute.post('/add',authenticate, upload.single('file'), addBlog);
BlogRoute.post('/edit/:blogid',authenticate, editBlog);
BlogRoute.put('/update/:blogid',authenticate,upload.single('file'), updateBlog);
BlogRoute.delete('/delete/:blogid',authenticate, deleteBlog);
BlogRoute.get('/get-blog/:blogid',authenticate, showBlog);
BlogRoute.get('/all-user-blog',authenticate,allBlog)
;
BlogRoute.get('/all-blog', optionalAuthenticate, allBlog)
BlogRoute.get('/feed', getPublicFeed);
BlogRoute.get('/activity', authenticate, getRecentActivity);
BlogRoute.post('/view/:slug', recordView);
BlogRoute.get('/getblog/:slug', getBlog);
BlogRoute.get('/getrelatedblog/:category/:currBlog', getRelatedBlog);
BlogRoute.get('/getblogbycategory/:category', getBlogBycategory);
BlogRoute.get('/search', search);

export default BlogRoute;
