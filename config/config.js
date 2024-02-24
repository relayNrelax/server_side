import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const DATABASE_URL = process.env.MONGODB

// const connectDB = async () => {
//     try {
//         await mongoose.connect(DATABASE_URL)
//         console.log(`Database connected Successfully..`)
//     } catch (error) {
//         console.log(error)
//     }
// }
const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL, {
            connectTimeoutMS: 60000, // Set connection timeout to 1 minute (60000 milliseconds)
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Database connected Successfully..`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB