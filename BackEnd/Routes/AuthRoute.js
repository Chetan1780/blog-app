import express from 'express';
const AuthRoute = express.Router();
import {authenticate} from '../Middleware/authenticate.js'
import {GoogleLogin, Login,Logout,Register} from '../Controllers/AuthController.js';
AuthRoute.post('/register',Register);
AuthRoute.post('/login',Login);
AuthRoute.post('/google-login',GoogleLogin);
AuthRoute.get('/logout',authenticate,Logout);
export default AuthRoute;