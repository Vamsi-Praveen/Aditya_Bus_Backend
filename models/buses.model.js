import mongoose from "mongoose"

const busSchema = new mongoose.Schema({

    busNumber: {
        type: Number,
        requied: true
    },
    busRoute: {
        type: String,
        required: true
    }
}, { timestamps: true, collection: 'buses' })

const Bus = mongoose.model('Bus', busSchema)

export default Bus