import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_APPNAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET, 
});
export default cloudinary;