import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import BusCount from "../models/busCount.model.js";

export const getScanningCountByBus = async (req, res) => {
    try {
        const { date, bus } = req.query;
        if (!date) {
            return res.status(400).send({ 'error': 'Query Parameter date is required' });
        }
        if (!bus) {
            return res.status(400).send({ 'error': 'Query Parameter bus is required' });
        }
        const scanningData = await BusCount.findOne({ date: date, busNumber: bus })
        if (!scanningData) {
            return res.status(404).send({ 'error': 'Data Not Found' });
        }
        return res.status(200).send({ details: scanningData })

    } catch (error) {
        return res.status(500).send({ Error: "Internal Server Error", error: error })
    }
}
//{todo: rud operations on operator in operator controller}

export const registerAdmin = async (req, res) => {
    try {
        const { firstname, lastname, username, password, phoneNumber, role } = req.body;
        // Check if user already exists in the database
        const isUserExists = await Admin.exists({ username: username })

        if (!isUserExists) {
            let hashedPassword = await bcrypt.hash(password, 10)
            const admin = new Admin({
                firstname: firstname,
                lastname: lastname,
                phoneNumber: phoneNumber,
                username: username,
                password: hashedPassword,
                role: role
            })
            await admin.save().then((data) => {
                return res.send({ success: 1 }).status(200)
            }).catch((err) => {
                return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })
            })
        }
        else {
            return res.status(400).send("Username Already Exists")
        }
    } catch (error) {
        return res.status(500).send({ Error: "Internal Server Error", error: error })
    }
}

//admin login

export const adminLogin = async (req, res) => {
    try {
        //getting username and password
        const { username, password } = req.body;
        await Admin.findOne({ "username": username }).then(async (data) => {
            if (!data) {
                return res.status(400).send({ 'Error': 'Invalid User' })
            }
            //checking the password is correct or not
            await bcrypt.compare(password, data.password)
                .then((result) => {
                    if (!result) {
                        //password wrong
                        return res.status(404).send({ 'Error': 'Invalid Password' })
                    }
                    const token = jwt.sign({ id: data._id, username: data.username }, process.env.JWT_SECRET)
                    //send the token in authorization header
                    return res.header('Authorization', `Bearer ${token}`).status(200).send({ "success": 1, "login": true })
                })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ ErrorMessage: "Internal Server Error", error: error })

    }
}