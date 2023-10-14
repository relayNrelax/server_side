import sg from '@sendgrid/mail';
import corn from "node-cron";
import schedule from "node-schedule";
import connectDB from '../config/config.js';
import AlertModel from '../models/alertModel.js';

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

}