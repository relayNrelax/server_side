import AlertModel from "../models/alertModel.js";
import SendEmail from "../service/sendEmailService.js";

export default class AlertService {
   
    async setAlert(data, user){
        try {
            if(!data) throw new Error("no data found to save alert")
            if(!data.a_start_date || !data.a_end_date) throw new Error("Start date and end date is required")
            
            const newAlert = new AlertModel({
                a_type: data.a_type,
                a_status: data.a_status,
                a_v_number: data.a_v_number,
                a_u_id: user._id,
                a_start_date: data.a_start_date,
                a_end_date: data.a_end_date,
                a_created_by: user.name
            });

            const saveAlert = await newAlert.save();
            return {status: true, data: saveAlert, user: user._id}
            
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