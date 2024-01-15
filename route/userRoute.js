import express from "express"
import UserController from "../controller/userController.js"
import VerifyToken from "../middleware/middleware.js"

const userRouter = express.Router()
const userController = new UserController

userRouter.use('/update/email', VerifyToken)
userRouter.use('/update/phonenumber', VerifyToken)

userRouter.post('/signup', userController.createUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/getUsers', userController.getUsers)
userRouter.patch('/update/email', userController.updateUserEmail)
userRouter.patch('/update/phonenumber', userController.updatePhoneNumber)

userRouter.patch('/reset/password/link', userController.forgetPassword)
userRouter.patch(`/set/password/:id`, userController.setPassword)

export default userRouter