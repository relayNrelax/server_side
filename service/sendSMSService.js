import twilio from 'twilio';

export default class SendSMSService {

    async configureSMS(user){
        try {
            const accountSid = 'ACd55d093c3b858690e80b0e58e75d073a'
            const authToken = '594ee23919c90182e1136c5b041b6a7c'
            const client = twilio(accountSid, authToken)

            return user            

        } catch (error) {
            return { status: false, message: error.message}
        }
    }
}