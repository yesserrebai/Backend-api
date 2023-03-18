import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const DBURI = process.env.DATABASE.replace('<PASSWORD>',process.env.DBPASSWORD);

mongoose.connect(DBURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB "))
.catch((error: Error) => console.log(error.message));

const DB = mongoose.connection;
export = DB;