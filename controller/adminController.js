import AlertService from "../service/alertService.js";
import AdminService from "../service/adminService.js";

export default class AdminController {
    constructor(){
        this.AlertService = new AlertService;
        this.AdminService = new AdminService;
    }

    adminLogin = async (req, res) => {
        try {
            const data = await this.AdminService.logInAdmin(req.body);
            res.send(data);
        } catch (error) {
            res.send(error.message);
        }
    }

    getUsers = async (req, res) => {
        try {
            const userData = await this.AdminService.getAllUsers()
            console.log(userData);
            res.send(userData) 
        } catch (error) {
            res.send(error.message);
        }
    }

    getAlerts = async (req, res) => {
        try {
            const alertData = await this.AdminService.alerts()
            res.send(alertData)
        } catch (error) {
            res.send(error.message)
        }
    }

    getAlertByUser = async (req, res) => {
        try {
            const userAlert = await this.AdminService.getAlertBuId(req.params.id);
            res.send(userAlert)
        } catch (error) {
            res.send(error.message)
        }
    }
}