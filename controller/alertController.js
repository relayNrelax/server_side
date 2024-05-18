import AlertService from "../service/alertService.js";
import AlertModel from "../models/alertModel.js";
import moment from "moment";
import SendEmailService from "../service/sendEmailService.js";
export default class AlertController {

    constructor() {
        this.AlertService = new AlertService();
        this.SendEmailService = new SendEmailService();
    }

    createAlert = async (req, res) => {
        try {
            const setAlert = await this.AlertService.setAlert(req.body, req.user)
            res.send({status: setAlert.status, setAlert});
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }

    getAllAlerts = async (req, res) => {
        try {
            const alerts = await this.AlertService.getAlert(req.user)
            res.send({status: alerts.status, data: alerts.data});
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }

    updateAlert = async (req, res) => {
        try {
            const updateAlert = await this.AlertService.updateAlert(req.body, req.user)
            res.send({status: updateAlert.status, data: updateAlert});
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }

    deleteAlert = async (req, res) => {
        try {
            const deleteAlert = await this.AlertService.deleteAlert(req.body, req.user)
            res.send({status: deleteAlert.status, data: deleteAlert});
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }

    sendAlert = async (req, res) => {
        try {
            const sendAlert = await this.SendEmailService.sendReminder(req.body)
            res.send(sendAlert);
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }

    cronAlert = async (req, res) => {
        try {            
            const currentDate = moment().format('DD/MM/YYYY');
            const nextDate = moment().add(1, 'day').format('DD/MM/YYYY');
            let alertData = await AlertModel.find({
                a_end_date: nextDate,
            });

            const promise = alertData.map(async (alert) => {
                try {
                    return await this.SendEmailService.cronReminder(alert._id);
                } catch (error) {
                    console.error(error.message);
                    return {status: false, message: error.message}
                }
            });
            const result = await Promise.all(promise);
            res.send(result);
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }
}