import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connect from './Config/connect.js';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoutes.js';
import CategoryRoute from './Routes/CategoryRoute.js';
import BlogRoute from './Routes/BlogRoute.js';
import CommentRoute from './Routes/CommentRoute.js';
import LikeRoute from './Routes/LikeRoute.js';


dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
//routes 
app.use('/api/auth',AuthRoute)
app.use('/api/user',UserRoute);
app.use('/api/category',CategoryRoute);
app.use('/api/blog',BlogRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/like',LikeRoute);
connect();

app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error!!!'
    res.status(status).json({
        success:false,
        status,
        message
    })
})

app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`)
})