import mongoose from "mongoose";

const alertSchema = mongoose.Schema({
    a_type: {type: 'string', required: 'Alert type is required'},
    a_v_number : {type: 'string', required: 'Vehicle number is required'},
    a_status: {type: 'string', required: 'Alert status is required'},
    a_u_id: {type: 'string', required: 'user id is required'},
    a_start_date: {type: 'string', required: 'alert start date is required'},
    a_end_date: {type:'string', required: 'alert end date is required'},
    a_created_by: {type: 'string', required: 'alert user is required'},
})

const AlertModel = mongoose.model('Alert', alertSchema);
export default AlertModel;