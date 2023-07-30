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

const allowedOrigins = [
  'https://master.d5wbnpaa0ldw8.amplifyapp.com',
  'https://master.d5wbnpaa0ldw8.amplifyapp.com/',
];

app.use(
  cors({
    origin: function (origin, callback) {
      const isAllowed = allowedOrigins.includes(origin);
      callback(null, isAllowed);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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
