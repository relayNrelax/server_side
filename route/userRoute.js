import express from "express"
import UserController from "../controller/userController.js"
import AdminController from "../controller/adminController.js"
import VerifyToken from "../middleware/middleware.js"

const userRouter = express.Router()
const userController = new UserController
const adminController = new AdminController

userRouter.use('/update/email', VerifyToken)
userRouter.use('/update/phonenumber', VerifyToken)

userRouter.post('/signup', userController.createUser)
userRouter.post('/login', userController.loginUser)
userRouter.patch('/update/email', userController.updateUserEmail)
userRouter.patch('/update/phonenumber', userController.updatePhoneNumber)

userRouter.patch('/reset/password/link', userController.forgetPassword)
userRouter.patch(`/set/password/:id`, userController.setPassword)

userRouter.post('/login/admin', adminController.adminLogin)
userRouter.get('/admin/getUsers', userController.getUsers)
userRouter.get('/getAlerts', adminController.getAlerts)
// userRouter.sendAlerts('/sendAlerts', adminController.sendAlerts)



export default userRouter