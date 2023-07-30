import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();

app.use(cors({ origin: 'https://master.d5wbnpaa0ldw8.amplifyapp.com' }));

// middleware
app.use(bodyParser.json());

// database connection
const dbURI = process.env.mongo_url;
console.log(dbURI);
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => console.log('connected to db...', result))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', requireAuth, userRoutes);

app.listen(process.env.PORT).on('listening', () => {
  console.log('🚀 are live');
});
