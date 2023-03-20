import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const dbUrl = process.env.DATABASE.replace('<PASSWORD>',process.env.DBPASSWORD)
mongoose.connect(dbUrl, <MongoDBOptions>{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`Connected to MongoDB`))
.catch((error: Error) => console.log(error.message));

const DB_CONNECTION = mongoose.connection

export default DB_CONNECTION

