import * as dotenv from "dotenv";
import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

dotenv.config();

const mongoUri: string | undefined = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in environment variables.');
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connection to MongoDB Atlas successful');
  })
  .catch(err => {
    console.error('Some error occurred:', err);
  });

let dbConnection: Db | null = null;

export const connectToDb = (cb: (err?: Error) => void): void => {
  MongoClient.connect(mongoUri)
    .then(client => {
      dbConnection = client.db();
      cb();
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      cb(err);
    });
};

export const getDb = (): Db | null => dbConnection;
