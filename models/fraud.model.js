
import mongoose from "mongoose"

const fraud_schema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    operator: {
        type: String,
        required: true
    },
    busNumber: {
        type: Number,
        required: true
    }
},{ collection: 'black_sheeps' })

const Fraud = mongoose.model('Fraud', fraud_schema)
export default Fraud