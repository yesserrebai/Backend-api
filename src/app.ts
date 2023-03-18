import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());



mongoose.connect(process.env.CONNECT_URL!, <MongoDBOptions>{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB "))
.catch((error: Error) => console.log(error.message));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server running on port 5000');
})