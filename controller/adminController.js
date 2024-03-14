import AlertService from "../service/alertService.js";
import AdminService from "../service/adminService.js";
import UserModel from "../models/userModel.js";

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
            res.send(userData) 
        } catch (error) {
            res.send(error.message);
        }
    }

    getAlerts = async (req, res) => {
        try {
            const alertData = await this.AdminService.alerts()
            const userId = alertData.map((data) => data.a_u_id);
            const userData = await UserModel.find({
                '_id': { $in: userId }
            })
            // console.log(userData);
            const alertsWithUserData = alertData.map((alert) => {
                const user = userData.find((user) => user._id.toString() === alert.a_u_id.toString());
                return {
                        _id: alert._id,
                        a_name: alert.a_name,
                        a_type: alert.a_type,
                        a_v_number: alert.a_v_number,
                        a_status: alert.a_status,
                        a_u_id: alert.a_u_id,
                        a_end_date: alert.a_end_date,
                        a_created_by: alert.a_created_by,
                        userPhone: user ? user.phone_number : null,
                        userAltNumber: user ? user.alternate_number : null,
                        userEmail : user ? user.email : null,
                        __v: alert.__v
                    }
            })
            // console.log(alertsWithUserData);
            res.status(200).send(alertsWithUserData);
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