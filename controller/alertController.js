import AlertService from "../service/alertService.js";

export default class AlertController {

    constructor() {
        this.AlertService = new AlertService();
    }

    createAlert = async (req, res) => {
        try {
            const setAlert = await this.AlertService.setAlert(req.body, req.user)
            res.send({status: setAlert.status, data: setAlert});
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
            const sendAlert = await this.AlertService.sendAlert(req.body, req.user)
            res.send({status: sendAlert.status, data: sendAlert});
        } catch (error) {
            res.send({status: false, error: error.message});
        }
    }
}