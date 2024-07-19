import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {type: String, require: "User name is require"},
    phone_number: {type: Number, require: "Phone number is require"},
    alternate_number: {type: Number, require: "Alternate number is require"},
    email: {type: String, require: "Email id is require"},
    v_number: {type: String, require: "Vehicle number is require"},
    password: {type: String, require: true},
},{ timestamps: true })

const UserModel = mongoose.model("User", userSchema)
export default UserModel