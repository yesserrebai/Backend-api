import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cors from 'cors';
import initRoutes from './init/init.routes';
import errorHandler from './middlewares/errorHandler';

const app = express();
app.use(bodyParser.json());

app.use(cors);
app.get('/ping', (_req, res) => {
  res.send('pong');
});

initRoutes(app);
app.use(errorHandler);

export default app;
