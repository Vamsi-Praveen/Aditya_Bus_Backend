import bcrypt from "bcrypt"
import Operator from "../models/operator.model.js";
import jwt from "jsonwebtoken"
import Student from "../models/student.model.js";
import { updateBusCount } from "./updateCount.controller.js";
import Bus from '../models/buses.model.js';
import ScanData from "../models/scanData.model.js";

export const operatorLogin = async (req, res) => {
    try {
        //getting operatorid and password
        const { operator_id, password } = req.body;
        await Operator.findOne({ "operator_id": operator_id }).then(async (data) => {
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
                    const token = jwt.sign({ id: data._id, operator_id: data.operator_id }, process.env.JWT_SECRET)
                    //send the token in authorization header
                    return res.header('Authorization', `Bearer ${token}`).status(200).send({ "success": 1, "login": true, 'data': data.operator_id })
                })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ ErrorMessage: "Internal Server Error", error: error })

    }
}

export const operatorRegistration = async (req, res) => {
    try {
        const { firstname, lastname, operator_id, password, phoneNumber } = req.body;
        // Check if user already exists in the database
        const isUserExists = await Operator.exists({ operator_id: operator_id })

        if (!isUserExists) {
            let hashedPassword = await bcrypt.hash(password, 10)
            const operator = new Operator({
                firstname: firstname,
                lastname: lastname,
                phoneNumber: phoneNumber,
                operator_id: operator_id,
                password: hashedPassword,
            })
            await operator.save().then((data) => {
                return res.send({ success: 1 }).status(200)
            }).catch((err) => {
                return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })
            })
        }
        else {
            return res.status(400).send("Operator Already Exists")
        }
    } catch (error) {
        return res.status(500).send({ Error: "Internal Server Error", error: error })
    }
}


export const checkStudent = async (req, res) => {
    try {
        const { rollNo, busNumber, operator } = req.body;
        const validStudent = await Student.findOne({ rollno: rollNo })
        if (validStudent) {
            req.busNumber = busNumber;
            req.rollNo = rollNo;
            req.operator = operator;
            await updateBusCount(req, res);
            return res.status(200).send({ details: validStudent });
        }
        //{todo: if invalid send notifcation to supervisor}
        else {
            return res.status(404).send({ 'Error': 'RollNo not exists' })
        }
    } catch (error) {
        return;
        // return res.status(500).send({ Error: "Internal Server Error", error: error })
    }
}

export const forgotOperatorPassword = async (req, res) => {
    try {
        const { operator_id, oldPassword, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Check if the operator exists
        const operator = await Operator.findOne({ operator_id: operator_id });
        if (!operator) {
            return res.status(404).send({ error: 'Operator Not Found' });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(oldPassword, operator.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid Password' });
        }

        // Update password
        operator.password = hashedPassword;
        await operator.save();

        return res.status(200).send({ message: 'Password Updated Successfully' });
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error', error: error });
    }

}

export const getValidBus = async (req, res) => {
    try {
        const { bus } = req.params;
        const busValid = await Bus.exists({ busNumber: bus })
        if (!busValid) {
            return res.status(404).send({ 'message': 'No such bus found.' });
        }
        return res.status(200).send({ 'success': 1 })
    } catch (err) {
        return res.status(500).send({ message: 'Internal Server Error', error: err })
    }
}

export const getScannedBusDetails = async (req, res) => {
    try {
        const { busNumber, date } = req.body;
        const getScannedDetails = await ScanData.find({ date: date, busNumber: busNumber })
        console.log(getScannedDetails)
        if (!getScannedDetails) {
            return res.status(404).send({ 'message': 'No Details Found' })
        }
        return res.status(200).send({ data: getScannedDetails })
    }
    catch (err) {
        return res.status(500).send({ message: 'Internal Server Error', error: err })
    }
}

export const getTodayBus = async (req, res) => {
    try {
        const { date, operator } = req.params;
        const getTodayBusDetails = await ScanData.find({ date: date, operator: operator })
        if (!getTodayBusDetails) {
            return res.status(404).send({ 'message': 'No Details Found' })
        }
        return res.status(200).send({ data: getTodayBusDetails })
    }
    catch (err) {
        return res.status(500).send({ message: 'Internal Server Error', error: err })
    }
}