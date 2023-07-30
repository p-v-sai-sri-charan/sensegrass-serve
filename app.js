  import express from 'express';
  import mongoose from 'mongoose';
  import { requireAuth } from './middleware/authMiddleware.js';
  // import env
  import dotenv from 'dotenv';

  //cors
  import cors from 'cors';

  import authRoutes from './routes/authRoutes.js';
  import userRoutes from './routes/userRoutes.js';
  import bodyParser from 'body-parser';

  const app = express();
  dotenv.config();
  // cors allow all
  const allowedOrigins = [
  'http://localhost:3000',
  'https://master.d5wbnpaa0ldw8.amplifyapp.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the request origin is in the allowedOrigins array
      const isAllowed = allowedOrigins.includes(origin);
      callback(null, isAllowed);
    },
  })
);
  


  // middleware
  app.use(bodyParser.json());


  // database connection
  const dbURI = process.env.mongo_url;
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => console.log('connected to db'))
    
    .catch((err) => console.log(err));
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  // routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/user',requireAuth,userRoutes);


  app.listen(process.env.PORT).on('listening', () => {
    console.log('🚀 are live');
  });
