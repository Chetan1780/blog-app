import express from 'express';
const UserRoute = express.Router();
import {GoogleLogin, Login,Logout,Register} from '../Controllers/AuthController.js';
import { deleteUser, getAllUsers, getUser,updateUser } from '../Controllers/Usercontroller.js';
import upload from '../Config/multer.js';
import { authenticate } from '../Middleware/authenticate.js';
UserRoute.use(authenticate)
UserRoute.get('/get-user/:userId',getUser);
UserRoute.get('/get-alluser',getAllUsers);
UserRoute.put('/update-user/:userId', upload.single('file') ,updateUser);
UserRoute.delete('/delete/:userid', deleteUser);

export default UserRoute;