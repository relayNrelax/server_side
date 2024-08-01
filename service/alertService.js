import AlertModel from "../models/alertModel.js";
import UserModel from "../models/userModel.js";
import VehicleModel from "../models/vehicleModel.js";
import SendEmail from "../service/sendEmailService.js";

export default class AlertService {
   
    async setAlert(data, user){
        try {
            const newAlert = new AlertModel({
                a_name: data.alertName,
                a_type: data.alertType,
                a_status: 'Pending',
                a_v_number: data.vehicleNumber,
                a_u_id: user._id,
                a_end_date: data.alertDate                ,
                a_created_by: user.name
            });

            const saveAlert = await newAlert.save();
            return {status: true, data: saveAlert, user: user._id}
            
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async saveAlert(user, data){
        try {
            const {id, alertType,alertDate, vehicleNumber, alertName} = data;
            let v_data = await VehicleModel.find({'v_u_id': user._id, '_id': id});
            const alert = {
                a_name: alertName,
                a_type: alertType,
                a_status: 'Pending',
                a_u_id: user._id,
                a_v_id: id,
                a_end_date: alertDate,
                a_created_by: user.name
            }

            const createAlert = await AlertModel.create(alert)

            return {status: true, v_data, input: data, create: createAlert};
        } catch (error) {
            return {status: false, message: error.message};
        }
    }

    async getAlert(user){
        try {

            const alerts = await AlertModel.find({a_u_id: user._id});
            return {status: true, data: alerts, user: user._id}
            
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async updateAlert(data, user){
        try {
            return {data: data, user: user._id}
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async deleteAlert(data, user){
        try {
            return {data: data, user: user._id}
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async sendAlert(data, user){
        try {
            let sendEmail = new SendEmail();
            
            const sendAlert = await sendEmail.sendAlert(data, user);
            return sendAlert

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async details(user){
        try {
            const u_details = await UserModel.find({_id: user._id})
            const totalAlertCount = await AlertModel.countDocuments({ a_u_id: user._id });
            const sentAlertCount = await AlertModel.countDocuments({ 
                a_u_id: user._id, 
                a_status: 'Sent' 
            });
            return {status: true, u_data: u_details, sCount: sentAlertCount, a_count: totalAlertCount};
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    async deleteAlerts(id) {
        try {
            const deleteResult = await AlertModel.deleteOne({ _id: id });
            return { status: true, data: deleteResult };
        } catch (error) {
            return {status: false, message: error.message}
        }
    }
}