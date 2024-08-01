import express from 'express';
import AlertController from '../controller/alertController.js';
import VerifyToken from '../middleware/middleware.js';

const alertRoute = express.Router();
const alertController = new AlertController();

alertRoute.use('/create/alert', VerifyToken)
alertRoute.post('/create/alert', alertController.createAlert);

alertRoute.use('/get/alert', VerifyToken)
alertRoute.get('/get/alert', alertController.getAllAlerts);

alertRoute.use('/details', VerifyToken)
alertRoute.get('/details', alertController.getDetails);

alertRoute.use('/updateAlert', VerifyToken)
alertRoute.patch('/updateAlert', alertController.updateAlert);

// alertRoute.use('/send/alert', VerifyToken)
alertRoute.post('/send/alert', alertController.sendAlert);
alertRoute.post('/delete', alertController.deleteAlert);

alertRoute.post('/addAlert', VerifyToken);
alertRoute.post('/addAlert', alertController.addAlert);


export default alertRoute;