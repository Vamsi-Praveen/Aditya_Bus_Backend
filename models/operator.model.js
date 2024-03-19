import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    operator_id: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'operator', timestamps: true, versionKey: false })


const Operator = mongoose.model('Operator', operatorSchema)
export default Operator;