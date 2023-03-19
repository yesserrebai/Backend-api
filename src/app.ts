import express from "express";
import dotenv from 'dotenv';
import cors from "cors"
import helmet from "helmet"
import path from "path"
import multer from "multer"
import morgan from "morgan"
import DB_CONNECTION from "./database/dbconfig";
import UserRouter from "./routes/userroutes";
const app = express();



/*Configurations */
dotenv.config();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(cors())
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb',extended: false}))

//This is used to log HTTP resquests and errors
if(process.env.NODE_ENV === "development"){
    app.use(morgan("tiny"))
}


DB_CONNECTION.on("error",(err)=>{
    console.log(err)
})

/*Routes*/

app.use("/",UserRouter)
app.get("/",(req,res)=>{
    res.send("Hello")
})

app.get('/favicon.ico', (req, res) => res.status(204));

app.all('*',(req,res)=>{
    res.status(404).json({
        msg: `Could not find that ${req.originalUrl} on this server`
    })
})


app.use(express.json());

export default app