import * as dotenv from 'dotenv';
import * as express from 'express';
import { Express, Request, Response } from 'express';
import { connectToDb, getDb } from './src/configuration/config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as http from 'http';
import router from './src/routes/user';

// Load environment variables
dotenv.config();

// Define types
let db: any;
const port: number = Number(process.env.PORT) || 3000;
const app: Express = express();
const server = http.createServer(app);

// Database connection
connectToDb((err: Error | null) => {
    if (!err) {
        server.listen(port, () => {
            console.log(`Listening on port: ${port}`);
        });
        db = getDb();
    } else {
        console.error('Database connection failed:', err);
    }
});

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(router);

// Starting route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Credit-Sea backend system !!');
});

export default app;