import UserModel from "../models/userModel.js";
import AlertModel from "../models/alertModel.js";
import bcrypt, {genSalt} from 'bcrypt'


export default class AdminService {

    logInAdmin = async(data) => {
        try {
            const {email, pass} = data;
            const user = await UserModel.findOne({email: email})
            if(!user) throw new Error ("User not found")

            const compare_password = await bcrypt.compare(pass, user.password)
            if(compare_password === false) throw new Error ("Password mismatch")

            return {status: true, message: "user is now logged in"}

        } catch (error) {
            return {status: false, message: error.message}
        }
    }


    getAllUsers = async() => {
        try {
            const users = await UserModel.find();
            if(!users) throw new Error ("User not found");
            return users
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    alerts = async() => {
        try {
            const alerts = await AlertModel.find();
            if(!alerts) throw new Error ("Alert not found");
            return alerts
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    sendAlert = async() => {
        try {

        } catch (error) {
            
        }
    }

}