import mongoose, { Mongoose } from 'mongoose';
import config from 'config';
import { DBConfig } from '../../shared/interfaces/config.interface';

const dbConfig: DBConfig = config.get('db');
const connectDB = (): Promise<Mongoose> => {
  return mongoose.connect(
    process.env.NODE_ENV === 'seed'
      ? `mongodb://${dbConfig.host}:${dbConfig.port}/?readPreference=primary&directConnection=true&ssl=false`
      : `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.name}?retryWrites=true&w=majority`,
    {},
  );
};

export default connectDB;
