import mongoose from "mongoose";

const ScanDataSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    busNumber: {
        type: Number,
        required: true
    },
    operator_id: {
        type: String,
        required: true
    }
}, { collection: 'scan_data', timestamps: true })

const ScanData = mongoose.model('ScanData', ScanDataSchema);
export default ScanData