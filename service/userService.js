import bcrypt, {genSalt} from 'bcrypt'
import jwt from 'jsonwebtoken'
import SendEmailService from './sendEmailService.js';
import UserModel from "../models/userModel.js";
import VehicleModel from '../models/vehicleModel.js';

export default class UserService {
    constructor() {
        this.SendEmailService = new SendEmailService();
    }

    saveUser = async (data) =>{
        const { email, password, confirmPassword, userName, phoneNumber, alternateNumber, v_number } = data;
        try {
            
            const existing_user = await UserModel.findOne({email: email});

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
                password: hashPassword
            })
            const saved_user = await newUser.save();
            if(!saved_user) throw new Error(`Something went wrong saving user please try again`);

            this.saveUserVehicles(v_number, saved_user);
            
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

    loggedInUser = async (user) => {
        try {
            const userData = await UserModel.find({_id: user._id});
            if(!userData) throw new Error (" cannot find user with id " + user._id + " in   the database");
            return {status: true, message: userData}
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
            const users = await UserModel.find().sort({ createdAt: -1 });
            if(!users) throw new Error ("User not found");
            return users
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    resetPassword = async (data, user) => {
        try {
            if(data.email.length === 0) return {status: false, message: "Please enter your email address"}
            const user_data = await UserModel.findOne({email: data.email});
            if(!user_data) return {status: false, message: "User not found please enter valid email address"}
            if(user_data.email === data.email){
                const send_reset_link = await this.SendEmailService.resetLink(data.email, user_data._id)
                if(send_reset_link.status === true){
                    return {
                        status: true, message: `Password reset link sent successfully to ${data.email} `
                    }
                }else{
                    return {status: false, message : `Fail to send password reset link Error: ${send_reset_link.message}`}
                }
            }else{
                return {status: false, message: `No user found form this email address ${data.email}`}
            }
        } catch (error) {
            return {status: false, message: error.message};
        }
    }

    setNewPass = async (pass, cnf_pass, id) => {
        try {

            if(pass === cnf_pass){
                const user_data = await UserModel.findById({_id: id});
                if(user_data._id == id){
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(pass, salt);
                    const update = await UserModel.findByIdAndUpdate(user_data._id, {$set: {password: hashPassword}});
                    if(update){
                        return {status: true, message: 'Password updated successfully'}
                    }else{
                        return {status: false, message: 'Failed to update password'}
                    }
                }else{
                    return {status: false, message: 'No user found from this id'}
                }
            }else{
                return {status: false, message: 'Password and Confirm Password not match'}
            }

        } catch (error) {
            return {status: false, message: error.message};
        }
    }
    vehicles = async (user, data) => {
        try {
            const userData = await UserModel.find({_id: user._id});
            console.log(userData, data);
        } catch (error) {
            return {status: false, message: error.message};
        }
    }

    saveUserVehicles = async (v_number, saved_user) => {
        if (v_number.length > 0) {
            // Split the string by comma and trim each number
            const vNumbers = v_number.split(',').map(v => v.trim());
    
            // Iterate over each vehicle number
            for (const v_num of vNumbers) {
                // Create a new instance of VehicleModel for each vehicle number
                const vehicle = new VehicleModel({
                    v_number: v_num,
                    v_u_id: saved_user._id,
                });
    
                try {
                    // Save each vehicle to the database
                    await vehicle.save();
                } catch (err) {
                    console.error(`Error saving vehicle ${v_num}: `, err);
                }
            }
        }
    }

    getVehicles = async (user) => {
        try {
            const vehicles = await VehicleModel.find({v_u_id: user._id});
            return vehicles
        } catch (error) {
            return {status: false, message: error.message}
        }
    };
    
    
}