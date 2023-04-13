import config from 'config';
import connectDB from './config/db/database';
import app from './app';

const serverConfig: { port: number } = config.get('server');
const dbConfig: { name: string } = config.get('db');

connectDB()
  .then(() => {
    console.log(`Connected To Database ${dbConfig.name}`);
  })
  .catch((err) => {
    console.log('Error Connecting To Database', err);
  });

app.listen(serverConfig.port, () => {
  console.info(`Listening on port ${serverConfig.port}`);
});
