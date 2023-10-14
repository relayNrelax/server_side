import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {type: String, require: "User name is require"},
    phone_number: {type: Number, require: "Phone number is require"},
    alternate_number: {type: Number, require: "Alternate number is require"},
    email: {type: String, require: "Email id is require"},
    zip: {type: Number, require: "Zip code is require"},
    password: {type: String, require: true},
})

const UserModel = mongoose.model("User", userSchema)
export default UserModel