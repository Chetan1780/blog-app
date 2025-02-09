import mongoose from "mongoose";
import dotenv from 'dotenv';
import { application } from "express";
dotenv.config();
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            ssl: true,
            dbName: "blog-application"
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

export default connect;