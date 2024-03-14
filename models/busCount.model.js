import mongoose from "mongoose";

const busCount = new mongoose.Schema({
    busNumber: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    scanned_counts: {
        type: Number,
        required: true,
        default: 0
    }
}, { collection: "busesData", timestamps: true })

const BusCount = mongoose.model('BusCount', busCount);
export default BusCount