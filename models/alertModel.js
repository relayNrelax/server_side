import mongoose from "mongoose";

const alertSchema = mongoose.Schema({
    a_name: {type: 'string', required: 'Alert name is required'},
    a_type: {type: 'string', required: 'Alert type is required'},
    a_v_id : {type: 'string', required: 'Vehicle number is required'},
    a_status: {type: 'string'},
    a_u_id: {type: 'string', required: 'user id is required'},
    a_end_date: {type:'string', required: 'alert end date is required'},
    a_created_by: {type: 'string', required: 'alert user is required'},
},{ timestamps: true })

const AlertModel = mongoose.model('Alert', alertSchema);
export default AlertModel;