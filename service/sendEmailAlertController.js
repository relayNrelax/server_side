import sg from '@sendgrid/mail';
import corn from "node-cron";
import schedule from "node-schedule";
import connectDB from '../config/config.js';
import AlertModel from '../models/alertModel.js';

sg.setApiKey(process.env.SG_API_KEY);

export default class AlertService {
    constructor(){
        
    }
}