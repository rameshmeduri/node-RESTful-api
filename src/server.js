import express from 'express';

import setupMiddware from './middleware'

import { router } from './api'
import db from './db'

let app = express();

const apiRouter = express.Router();

setupMiddware(app);

db.connect();

app.use('/api', (req, res, next) => {
  console.log('hello from api');
  next();
}, router);

// GET -> / = {root: true}
app.get('/', (req, res) => res.json({root: true}));

export default app;
