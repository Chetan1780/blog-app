import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(cors({
    origin: process.env.FRONTEND_URL?.split(',').map((origin) => origin.trim()),
    credentials:true
}));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));
//routes 
app.use('/api/auth',AuthRoute)
app.use('/api/user',UserRoute);
app.use('/api/category',CategoryRoute);
app.use('/api/blog',BlogRoute)
app.use('/api/comment',CommentRoute)
app.use('/api/like',LikeRoute);
app.get('/api/health', (req, res) => res.status(200).json({ success: true }));

app.use((err,req,res,next)=>{
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error!!!'
    res.status(status).json({
        success:false,
        status,
        message
    })
})

connect().then(() => app.listen(port,()=> console.log(`Server is listening on port: ${port}`)));
