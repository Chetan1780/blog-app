import express from 'express';
const UserRoute = express.Router();
import { deleteUser, getAllUsers, getUser, updateUser, updateUserStatus } from '../Controllers/Usercontroller.js';
import upload from '../Config/multer.js';
import { authenticate } from '../Middleware/authenticate.js';
import { authenticateadmin } from '../Middleware/authenticateadmin.js';
UserRoute.use(authenticate)
UserRoute.get('/get-user/:userId',getUser);
UserRoute.get('/get-alluser', authenticateadmin, getAllUsers);
UserRoute.put('/update-user/:userId', upload.single('file') ,updateUser);
UserRoute.patch('/status/:userId', authenticateadmin, updateUserStatus);
UserRoute.delete('/delete/:userid', authenticateadmin, deleteUser);

export default UserRoute;
