import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/config.js';
import userRouter from './route/userRoute.js';
import alertRoute from './route/alertRoute.js';

dotenv.config();

const app = express();
app.use(cors({
    // origin: 'https://relynrelax.com',
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}));

const port = 5001;

(async () => {
    try {
        await connectDB(); // Establish the MongoDB connection
        app.use(express.json({ limit: "50mb", extended: true }));
        app.use(express.json());

        app.use('/api/user', userRouter);
        app.use('/api/alert', alertRoute);

        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
})();
