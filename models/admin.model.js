import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
}, { collection: "admin", timestamps: true })

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;