import BusCount from "../models/busCount.model.js";
import Bus from "../models/buses.model.js";
import ScanData from "../models/scanData.model.js";
import Student from "../models/student.model.js";

export const updateBusCount = async (req, res) => {

    const date = new Date().toISOString().split('T')[0].split('-').reverse().join('-').toString();
    const busNumber = req.busNumber;
    const rollNo = req.rollNo;
    const operator = req.operator;
    const busValid = await Bus.findOne({ busNumber: busNumber });
    // if (busValid) {
    //     let count = await BusCount.findOne({ date: date, busNumber: busNumber });
    //     if (!count) {
    //         await BusCount.create({
    //             busNumber: busNumber,
    //             date: date,
    //             scanned_counts: 1
    //         }) 
    //         const studentDetails = await Student.findOne({ rollno: rollNo })
    //         const alreadyScanned = await ScanData.exists({ rollno: rollNo, date: date })
    //         if (!alreadyScanned) {
    //             if (studentDetails) {
    //                 await ScanData.create({
    //                     rollNo: rollNo,
    //                     firstName: studentDetails.firstname,
    //                     lastName: studentDetails.lastname,
    //                     busNumber: busNumber,
    //                     date: date
    //                 })
    //                 return;
    //             }
    //         }
    //         else {
    //             console.log("Already Scanned");
    //             return res.status(400).send({ message: "Already Scanned", scanned: true })
    //         }
    //         return;
    //     }
    //     count.scanned_counts++;
    //     await count.save();
    //     const alreadyScanned = await ScanData.exists({ rollNo: rollNo, date: date })
    //     //     console.log(alreadyScanned)
    //     if (!alreadyScanned) {
    //         if (studentDetails) {
    //             await ScanData.create({
    //                 rollNo: rollNo,
    //                 firstName: studentDetails.firstname,
    //                 lastName: studentDetails.lastname,
    //                 busNumber: busNumber,
    //                 date: date
    //             })
    //             return;
    //         }
    //     }
    //     else {
    //         //         console.log("Already Scanned");
    //         return res.status(400).send({ message: "Already Scanned", scanned: true })
    //     }
    //     return;
    // }
    // else {
    //     return res.status(404).send({ 'message': "Invalid Bus Number" });
    // }


    if (busValid) {
        const isAlreadyExist = await ScanData.findOne({ date: date, rollNo: rollNo })
        if (!isAlreadyExist) {
            const studentDetails = await Student.findOne({ rollno: rollNo });
            if (studentDetails) {
                let newScanData = new ScanData({
                    rollNo: rollNo,
                    date: date,
                    busNumber: busNumber,
                    firstName: studentDetails.firstname,
                    lastName: studentDetails.lastname,
                    operator_id: operator
                })
                await newScanData.save();
                return;
            }
        }
        else {
            return res.status(400).send({ 'message': "Already Scanned" })
        }
    }
}
