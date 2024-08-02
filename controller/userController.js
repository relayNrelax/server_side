import UserService from "../service/userService.js";

export default class UserController {
    constructor(){
        this.UserService = new UserService
    }

    createUser = async (req, res) => {
        try {
            const userData = await this.UserService.saveUser(req.body)
            res.send(userData)
        } catch (error) {
            console.log(error.message);
        }
    }

    loginUser = async (req, res) => {
        try {
            const loginUser = await this.UserService.loginUser(req.body)
            res.send(loginUser)
        } catch (error) {
            res.send(error.message);
        }
    }

    getUsers = async (req, res) => {
        try {
            const userData = await this.UserService.getAllUser()
            res.send(userData) 
        } catch (error) {
            res.send(error.message);
        }
    }

    loggedInUser = async (req, res) => {
        try {
            const userData = await this.UserService.loggedInUser(req.user);
            res.send(userData);
        } catch (error) {
            res.send({statusbar: 'error', error: error.message});
        }
    }

    updateUserEmail = async (req, res) => {
        try {
            const updatedEmail = await this.UserService.updateUserEmail(req.body, req.user)
            res.send(updatedEmail);
        } catch (error) {
            res.send(error.message);
        }
    }

    updatePhoneNumber = async (req, res) => {
        try {
            const updatedPhoneNumber = await this.UserService.updatePhoneNumber(req.body, req.user)
            res.send(updatedPhoneNumber);
        } catch (error) {
            res.send(error.message);
        }
    }

    forgetPassword = async (req, res) => {
        try {
            const is_success = await this.UserService.resetPassword(req.body, req.user);
            res.send(is_success);
        } catch (error) {
            res.send(error.message);
        }
    }

    setPassword = async (req, res) => {
        try {
            const {id} = req.params;
            const {pass, cnf_pass} = req.body;
            const data = await this.UserService.setNewPass(pass, cnf_pass, id);
            res.send(data);
        } catch (error) {
            res.send(error.message);
        }
    }

    addVehicle = async (req, res) => {
        try {
            const addVehicle = await this.UserService.saveVehicles(req.user, req.body);
            res.send(addVehicle);
        } catch (error) {
            res.send({status: false, message:error.message});
        }
    }

    editVehicles = async (req, res) => {
        try {
            const v_data = await this.UserService.edit_vehicle(req.user, req.body);
            res.send({status: true, data: v_data});    
        } catch (error) {
            res.send({status: false, message: error.message});
        }
    }

    deleteVehicle = async (req, res) => {
        try {
            const delete_v = await this.UserService.delete_vehicle(req.user, req.params.id);
            res.send(delete_v);
        } catch (error) {
            res.send({status: false, message: error.message});
        }
    }

    getVehiclesById = async (req, res) => {
        try {
            const v_data = await this.UserService.getVehicles(req.user);
            res.send({status: true, data: v_data});    
        } catch (error) {
            res.send({status: false, message: error.message});
        }
    }

    getAllVehicles = async (req, res) => {
        try {
            const v_data = await this.UserService.getAdminVehicles();
            res.send(v_data);
        } catch (error) {
            res.send({status: false, message: error.message});
        }
    }
}