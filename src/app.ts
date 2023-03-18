import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(express.json());

const DB = require("./database/dbconfig")
DB.on("error",(err)=>{
    console.log(err)
})

DB.once('open',()=>{
    console.log("Database is connected")
})


export default app