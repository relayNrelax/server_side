import mongoose  from "mongoose";

const vehicleSchema = mongoose.Schema({
    v_number: {type: 'string'},
    v_u_id: {type: 'string', required: true},
    v_a_id: {type: 'string'}
}, {timestamps: true})

const VehicleModel = mongoose.model('Vehicle', vehicleSchema);
export default VehicleModel;