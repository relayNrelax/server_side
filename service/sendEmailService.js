import axios from "axios";
import corn from "node-cron";
import sg from '@sendgrid/mail';
import schedule from "node-schedule";
import connectDB from '../config/config.js';
import UserModel from "../models/userModel.js";
import AlertModel from '../models/alertModel.js';
import { response } from "express";
import ElasticEmail from "@elasticemail/elasticemail-client";

sg.setApiKey(process.env.SG_API_KEY);
export default class SendEmailService {
    constructor() {
       connectDB()
            .then(() => {
                corn.schedule("0 0 * * *", async () => {
                    try {
                        await this.sendEmailReminders();
                    } catch (error) {
                        return {status: false, message: error.message}
                    }
                })
            })
            .catch((error) => {
                return {status: false, message: error.message}
            })
    }

    sendEmail = async (to, subject, text) => {
        try {
            
            const msg = {
                to: to,
                from: 'bishaldeb282@gmail.com',
                subject: subject,
                html: text,
            }

            this.sg.send(msg).then(() => {return {status: true, message: "Email sent successfully"}}).catch((err) => {return {status: false, message: err.message}});

        } catch (error) {
            return error.message
        }
    }

    sendReminder = async (data) => {
        try {
           const alert = await AlertModel.findById(data.userData)
           const alert_id = alert._id;
           const user = await UserModel.findById(alert.a_u_id);
           if(!user) return {status: false, message: 'No user available for this id'};
           let defaultClient = ElasticEmail.ApiClient.instance;
           let apiKey = defaultClient.authentications['apikey'];
           apiKey.apiKey = '6E116318C3FD015B88463D119A995C240359C569D06411D3BFF3B81048A939AB2A89B85F1117881B00DF616466C355CD'
    
           let api = new ElasticEmail.EmailsApi()
            let email_data = ElasticEmail.EmailMessageData.constructFromObject(
                {
                    Recipients: [
                        new ElasticEmail.EmailRecipient(user.email)
                    ],
                    Content: {
                        Body: [
                            ElasticEmail.BodyPart.constructFromObject({
                                ContentType: "HTML",
                                Content: `Dear ${user.name},<br><br>

                                We hope this message finds you well. We wanted to bring to your attention that your ${alert.a_type} is scheduled to expire soon.<br><br>
                                
                                Expiration Date: ${alert.a_end_date}<br><br>
                                
                                To ensure uninterrupted access to ${alert.a_type}, we recommend taking prompt action to renew your ${alert.a_type} before the expiration date.<br><br>
                                
                                If you have any questions or need assistance with the renewal process, please don't hesitate to reach out to us. We're here to help.<br><br>
                                
                                Thank you for your attention to this matter.<br><br>
                                
                                Best regards,<br>
                                RelyNRelax<br>
                                `
                            })
                        ],
                        Subject: `RelyNrelax ${alert.a_type} reminder email. `,
                        From: 'bishal@letscalendar.com'
                    }
                }
            )

            return new Promise((resolve, reject) => {
                var callback = async (err, data, response) => {
                    if (err) {
                        try {
                            const update = await AlertModel.findOneAndUpdate(
                                { _id: alert_id },
                                { $set: { a_status: 'Fail' } },
                                { returnOriginal: false }
                            );
                            console.log(update);
                            resolve({ status: false, message: err });
                        } catch (updateError) {
                            reject({ status: false, message: updateError });
                        }
                    } else {
                        try {
                            const update = await AlertModel.findOneAndUpdate(
                                { _id: alert_id },
                                { $set: { a_status: 'Sent' } },
                                { returnOriginal: false }
                            );
                            console.log(update)
                            resolve({ status: true, message: 'Alert Sent Successfully' });
                        } catch (updateError) {
                            reject({ status: false, message: updateError });
                        }
                    }
                };
            
                api.emailsPost(email_data, callback);
            });
            

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    resetLink1 = async (email) => {
        try {
            let defaultClient = ElasticEmail.ApiClient.instance;
            let apiKey = defaultClient.authentications['apikey'];
            apiKey.apiKey = '6E116318C3FD015B88463D119A995C240359C569D06411D3BFF3B81048A939AB2A89B85F1117881B00DF616466C355CD'

            let api = new ElasticEmail.EmailsApi()
            let email_data = ElasticEmail.EmailMessageData.constructFromObject(
                {
                    Recipients: [
                        new ElasticEmail.EmailRecipient(email)
                    ],
                    Content: {
                        Body: [
                            ElasticEmail.BodyPart.constructFromObject({
                                ContentType: "HTML",
                                Content: "RelyNrelax Password reset Link"
                            })
                        ],
                        Subject: 'RelyNrelax Password reset Link',
                        From: 'bishal@letscalendar.com'
                    }
                }
            )

            var callback = (err, data, response) => {
                if(err){
                    return {
                        status: false,
                        message: err
                    }
                }else{
                    return {
                        status: true,
                        message: 'Password reset link sent successfully'
                    }
                }
            }

            api.emailsPost(email_data, callback);

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    resetLink = (email, id) => {
        return new Promise((resolve, reject) => {
            try {
                let defaultClient = ElasticEmail.ApiClient.instance;
                let apiKey = defaultClient.authentications['apikey'];
                apiKey.apiKey = '6E116318C3FD015B88463D119A995C240359C569D06411D3BFF3B81048A939AB2A89B85F1117881B00DF616466C355CD'
                
                const link = `https://relynrelax.com/new/password/${id}`
                console.log(link)

                let api = new ElasticEmail.EmailsApi()
                let email_data = ElasticEmail.EmailMessageData.constructFromObject(
                    {
                        Recipients: [
                            new ElasticEmail.EmailRecipient(email)
                        ],
                        Content: {
                            Body: [
                                ElasticEmail.BodyPart.constructFromObject({
                                    ContentType: "HTML",
                                    Content: `<p>Please click on the below link which will take you to password</p><br><br>
                                            <p><a href="${link}">https://relynrelax.com/new/password</a></p>`

                                })
                            ],
                            Subject: 'RelyNrelax Password reset Link',
                            From: 'bishal@letscalendar.com'
                        }
                    }
                )
    
                var callback = (err, data, response) => {
                    if(err){
                        reject({ status: false, message: err });
                    } else {
                        resolve({ status: true, message: 'Password reset link sent successfully' });
                    }
                }
    
                api.emailsPost(email_data, callback);

            } catch (error) {
                reject({ status: false, message: error.message });
            }
        });
    }



}