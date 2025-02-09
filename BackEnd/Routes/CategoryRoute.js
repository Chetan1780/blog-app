import express from 'express'
import { addCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from '../Controllers/CategoryController.js';
import {authenticateadmin} from '../Middleware/authenticateadmin.js'
const CategoryRoute = express.Router();
CategoryRoute.post('/add',  authenticateadmin, addCategory);
CategoryRoute.get('/show/:categoryid', authenticateadmin,  showCategory);
CategoryRoute.delete('/delete/:categoryid', authenticateadmin , deleteCategory);
CategoryRoute.put('/update/:categoryid', authenticateadmin,updateCategory);

CategoryRoute.get('/all-category', getAllCategory);
export default CategoryRoute; 