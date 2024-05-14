import AlertModel from "../models/alertModel.js";
import unirest from 'unirest';
import axios from "axios";
import AlertService from "../service/alertService.js";
import SendEmailService from "../service/sendEmailService.js";
import tz from 'moment-timezone';
import moment from "moment";
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
            const currentDate = moment().startOf('day').set({ hour: 18, minute: 30, second: 0, millisecond: 0 }).toISOString();
            const nextDate = moment().add(1, 'days').startOf('day').set({ hour: 23, minute: 60, second: 0, millisecond: 0 }).toISOString();

            let alertData = await AlertModel.find({
                a_end_date: nextDate
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

    smsAlert = async (alertId) => {
        try {
            const number = '8403993822';
            const message = 'RelyNrelax test OTP is 7890';
            const url = 'https://www.fast2sms.com/dev/bulkV2';
            const API_KEY = 'XB6tL0F9CurIV4Ggcm1EonMTy3xwj8Yqf5KUelidAQZk7Rh2aD0Vf8JXyalnuPTxSpkheo1WNK36Emzi';

            const smsData = {
                message: message,
                language: 'english',
                route: 'q',
                numbers: number
            }

            axios
                .post(url, smsData, {
                    headers: {
                        Authorization : API_KEY,
                    }
                })
                .then(response => {
                    console.log(response);
                })
                .catch(err => {{
                    console.log(err);
                }});


        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }
}