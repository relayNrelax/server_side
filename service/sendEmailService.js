import axios from "axios";
import corn from "node-cron";
import sg from '@sendgrid/mail';
import schedule from "node-schedule";
import connectDB from '../config/config.js';
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

    sendAlert = async (data, user) => {
        try {
            const userId = user._id
            if(!userId) return {status: false, message: "User not found"}
            const alertData = await AlertModel.find({a_u_id:userId});

            const endDate = [];

            alertData.forEach(element => {
                const alertObj = {
                    startDate : element.a_start_date,
                    endDate : element.a_end_date,
                    vehicleNumber : element.a_v_number,
                    alertType : element.a_type,
                    userId : element.a_u_id
                }

                endDate.push(alertObj);
            });

            const sendReminder = await this.sendEmailReminder(endDate, user);

            return {data: sendReminder, user: user}
        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    sendEmailReminder = async (data, user) => {
        try {
            const endDates = [];
            data.forEach(element => {
                return endDates.push(element.endDate);
            });

            for (const endDate of endDates) {
                const reminderDate = new Date(endDate);
                reminderDate.setDate(reminderDate.getDate() - 1);

                if(reminderDate > new Date()) {
                    const msg = {
                        to: 'bishaldeb282@gmail.com',
                        from: 'bishaldeb282@gmail.com',
                        subject: "Alert",
                        html: `<h1>Alert</h1>`,
                    };

                    await new Promise((resolve, reject) => {
                        const job = schedule.scheduleJob(reminderDate, () => {
                            sgMail
                                .send(msg)
                                .then(() => {
                                    resolve({ status: true, message: "Email sent successfully" });
                                })
                                .catch((err) => {
                                    reject({ status: false, message: err.message });
                                });
                        });
                    });

                    return {status: true, message: "Email sent successfully"}
                }

            }

            return { status: false, message: "No reminders scheduled" };

        } catch (error) {
            return {status: false, message: error.message}
        }
    }

    sendEmailReminders = async () => {
        try {
            const currentDate = new Date();

            const alertToRemind = await AlertModel.find({
                a_end_date: {
                    $gte: currentDate,
                    $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
                },
                a_u_id: user._id,
            })

            for (const alert of alertToRemind) {
                const sendReminder = await this.sendEmailReminder(
                    [
                        {
                            startDate: alert.a_start_date,
                            endDate: alert.a_end_date,
                            vehicleNumber: alert.a_v_number,
                            alertType: alert.a_type,
                            userId: alert.a_u_id,
                        }
                    ],
                    user
                );

                return {status: true, message: `Email sent successfully with ${alert._id}`, sendReminder};
            }
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
    

    // resetLink = async (email) => {
    //     try {
    //         const apiKey = '6E116318C3FD015B88463D119A995C240359C569D06411D3BFF3B81048A939AB2A89B85F1117881B00DF616466C355CD'
    //         const apiUrl = 'https://api.elasticemail.com/v4/emails/transactional';

    //         const payload = {
    //             from: 'bishal@letscalendar.com',
    //             to: email,
    //             subject: 'relyNrelax password reset email',
    //             body: `<p>Please Click on this link and it will take you relyNrelax.com reset password page.</p>
    //             <p><a href="https://relynrelax.com/dashboard"></a></p>`
    //         }
    //         axios.post(apiUrl, payload, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'X-ElasticEmail-ApiKey': apiKey,
    //             }
    //         })
    //         .then(response => {
    //             return {
    //                 status: true,
    //                 message: response.data
    //             }
    //         })
    //         .catch(error => {
    //             return {
    //                 status: false,
    //                 message: error.response.data
    //             }
    //         })
    //     } catch (error) {
    //         return {status: false, message: error.message}
    //     }
    // }

}