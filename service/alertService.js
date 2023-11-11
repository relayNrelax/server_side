import AlertModel from "../models/alertModel.js";
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
}