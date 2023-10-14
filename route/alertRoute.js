import express from 'express';
import AlertController from '../controller/alertController.js';
import VerifyToken from '../middleware/middleware.js';

const alertRoute = express.Router();
const alertController = new AlertController();

alertRoute.use('/setalert', VerifyToken)
alertRoute.post('/setalert', alertController.createAlert);

alertRoute.use('/updateAlert', VerifyToken)
alertRoute.patch('/updateAlert', alertController.updateAlert);

alertRoute.use('/sendAlert', VerifyToken)
alertRoute.post('/sendAlert', alertController.sendAlert);


export default alertRoute;