import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bodyParser from 'body-parser';

const app = express();
import fs from 'fs';
import https from 'https';
dotenv.config();

app.use(cors());

// middleware
app.use(bodyParser.json());

// database connection
const dbURI = process.env.mongo_url;
console.log(dbURI);
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => console.log('connected to db...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', requireAuth, userRoutes);

// Load SSL certificate and private key
const privateKey = fs.readFileSync('./private.key', 'utf8');
const certificate = fs.readFileSync('./certificate.crt', 'utf8');
const ca = fs.readFileSync('./ca_bundle.crt', 'utf8'); // Only needed if you have CA bundle

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca, // Optional, depending on your certificate setup
};

// Create the HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(5000, () => {
  console.log('Express app running over HTTPS on port 5000');
});