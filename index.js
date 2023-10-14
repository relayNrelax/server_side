import dotenv from 'dotenv'
import express from 'express';
import connectDB from './config/config.js';
import userRouter from './route/userRoute.js';
import cors from "cors"
import alertRoute from './route/alertRoute.js';
dotenv.config()

const app = express()
app.use(cors({
    origin: 'https://relynrelax.com/',
}))

const port = 5001

connectDB()
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.json());

app.use('/api/user', userRouter)
app.use('/api/alert', alertRoute)

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})