import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO)
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

app.listen(3000, () => console.log("Server is running on port 3000"));