import bcrypt, {genSalt} from 'bcrypt'
import jwt from 'jsonwebtoken'
import SendEmailService from './sendEmailService.js';
import UserModel from "../models/userModel.js";

export default class UserService {
    constructor() {
        this.SendEmailService = new SendEmailService();
    }

    saveUser = async (data) =>{
        
        const { email, password, confirmPassword, userName, phoneNumber, alternateNumber, zip } = data;

        try {
            
            const existing_user = await UserModel.findOne({email: email})

            if(existing_user) throw new Error(`User with email: ${email} already exists`);
            if(password !== confirmPassword) throw new Error(`Password and confirmPassword are not the same`);
            if(phoneNumber === alternateNumber) throw new Error(`Alternate number must be different from phoneNumber`);

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new UserModel({
                name: userName,
                phone_number: phoneNumber,
                alternate_number: alternateNumber,
                email: email,
                zip: zip,
                password: hashPassword
            })

            const saved_user = await newUser.save();
            if(!saved_user) throw new Error(`Something went wrong saving user please try again`);
            
            const subject = "SignUp successfully";
            const text = `<p><strong>SignUp successfully on relayNrelax.com</strong></p>`

            const sendEmail = await this.SendEmailService.sendEmail(saved_user.email, subject, text);
            const token = jwt.sign({userId: saved_user._id}, process.env.SECRET_KEY, {expiresIn: '10d'})

            return {status: true, data: saved_user, token: token, email: sendEmail}

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    loginUser = async (data) => {
        try {
            const {email, password} = data

            if(!email) throw new Error ("Please enter email address for login")
            if(!password) throw new Error ("Please enter email password for login")
            
            const user = await UserModel.findOne({email: email})

            if(!user) throw new Error ("User not found")

            const compare_password = await bcrypt.compare(password, user.password)
            if(compare_password === false) throw new Error ("Password mismatch")

            const token  = jwt.sign({userId : user._id} , process.env.SECRET_KEY, {expiresIn: '10d'})

            return {status: true, token: token, message: "user is now logged in"}

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    updateUserEmail = async (data, userData) => {
        try {
            const {email} = data;

            if(email === userData.email) throw new Error ("Email already in use ");
            const saved_email = await UserModel.findOne({email: email})
            if(saved_email) throw new Error ("Email already exists");
            await UserModel.findByIdAndUpdate(userData._id, {$set: {email: email}})

            const user  = await UserModel.findOne({email: email})

            if(user.email === email) {
                const subject = "Email address updated successfully";
                const text = `<p><strong>Email address updated successfully</strong></p>
`                
                const sendEmail = this.SendEmailService.sendEmail(user.email, subject, text);
                return {status: true, message: "Email address updated successfully", email: sendEmail}
            } else {
                return {status: false, message: "fail to update email"}
            }

        } catch (error) {
            return {status: false, message: error.message}
        }
    }
    
    updatePhoneNumber = async (data, userData) => {
        try {
            const user = await UserModel.findOne({email: userData.email})
            
            if(!user) throw new Error('User not found');
            if(data.phone_number === user.phone_number) throw new Error('Phone number already exists');
            if(data.phone_number === user.alternate_number) throw new Error('Phone number is must be different from alternative number');
            await UserModel.findByIdAndUpdate(userData._id, {$set: {phone_number: data.phone_number}})

            const updatedEmail  = await UserModel.findOne({email: userData.email})

            if(updatedEmail.phone_number === data.phone_number) {
                const subject = "Phone number updated successfully";
                const text = `<p><strong>Phone number updated successfully</strong></p>
`                
                const sendEmail = this.SendEmailService.sendEmail(user.email, subject, text);
                return {status: true, message: "Phone number updated successfully", email: sendEmail}
            }else{
                return {status: false, message: "fail to update phone number"}
            }

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    getAllUser = async () =>{
        try {
            const users = await UserModel.find();
            if(!users) throw new Error ("User not found");
            return users
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    
}