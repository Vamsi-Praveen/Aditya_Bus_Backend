import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true,
        unique: true
    },
    college: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    cityName: {
        type: String,
        required: true
    },
    busRoute: {
        type: String,
        required: true
    },
    mappedBus: {
        type: Number,
        required: true
    },
    feePaid: {
        type: Boolean,
        default: false
    },
    isBusCanceled: {
        type: Boolean,
        default: false
    }
}, { collection: 'students', timestamps: true, versionKey: false })


const StudentModel = mongoose.model('Student', studentSchema)
export default StudentModel;