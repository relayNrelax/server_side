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

userRouter.get('/loggedUser', VerifyToken)
userRouter.get('/loggedUser', userController.loggedInUser)

userRouter.post('/login/admin', adminController.adminLogin)
userRouter.get('/admin/getUsers', userController.getUsers)
userRouter.get('/getAlerts', adminController.getAlerts)


//vehicle details
userRouter.use('/vehicle', VerifyToken)
userRouter.post('/vehicle', userController.addVehicle)

// edit
userRouter.use('/edit-vehicle', VerifyToken)
userRouter.patch('/edit-vehicle', userController.editVehicles)

//delete
userRouter.use('/delete-vehicle/:id', VerifyToken)
userRouter.delete('/delete-vehicle/:id', userController.deleteVehicle)


userRouter.use('/get/vehicle', VerifyToken)
userRouter.get('/get/vehicle', userController.getVehiclesById)
// userRouter.sendAlerts('/sendAlerts', adminController.sendAlerts)

//get all vehicles
userRouter.get('/get-all-vehicles', userController.getAllVehicles);



export default userRouter