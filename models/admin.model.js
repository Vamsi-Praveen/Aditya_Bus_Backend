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
    },
    role: {
        type: String,
        enum: ['admin', 'superAdmin'],  // superAdmin is the highest level of access
        default: 'admin'
    }
}, { collection: "admin", timestamps: true })

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;