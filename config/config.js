import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const DATABASE_URL = process.env.MONGODB

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL)
        console.log(`Database connected Successfully..`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB