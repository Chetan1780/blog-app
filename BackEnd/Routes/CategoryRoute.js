import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../Controllers/CategoryController.js';
import {authenticateadmin} from '../Middleware/authenticateadmin.js'
import { authenticate } from '../Middleware/authenticate.js';
const CategoryRoute = express.Router();
CategoryRoute.post('/add', authenticate, authenticateadmin, addCategory);
CategoryRoute.get('/show/:categoryid', authenticate, authenticateadmin, showCategory);
CategoryRoute.delete('/delete/:categoryid', authenticate, authenticateadmin, deleteCategory);
CategoryRoute.put('/update/:categoryid', authenticate, authenticateadmin,updateCategory);

CategoryRoute.get('/all-category', getAllCategory);
export default CategoryRoute; 
