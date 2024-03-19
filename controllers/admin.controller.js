import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import BusCount from "../models/busCount.model.js";
import Student from "../models/student.model.js";
import ScanData from "../models/scan_data.model.js";
import Operator from "../models/operator.model.js";
import Fraud from "../models/fraud.model.js";



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

export const adminLogin = async (req, res, next) => {
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


export const getDetailsByRollNo = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findOne({rollno:id})
        if(student){ return res.status(200).json({message:'success', student});}
        return res.status(400).json({message:'fail'})
    }
    catch (err) {
        return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })

    }
}


export const changeAdminPassword = async (req, res) => {
    try {
        const { id, oldPassword, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Check if the operator exists
        const admin = await Admin.findOne({ _id: id });
        if (!admin) {
            return res.status(404).send({ error: 'User Not Found' });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid Password' });
        }

        // Update password
        admin.password = hashedPassword;
        await admin.save();

        return res.status(200).send({ message: 'Password Updated Successfully' });
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error', error: error });
    }

}

export const logout = (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ error: "UnAuthorized" });
    }
    const accessToken = token.split(' ')[1];
    res.send({message:'success'})
}

export const getAdminDetails =async (req, res) =>{
    try{
        const {id} = req.params;
        let admin = await Admin.findOne({_id:id}, "-password");
        if(!admin) return res.status(404).json('Error fetching data');
        return res.status(200).json(admin);
    }catch(err){
        console.log(err);
    }
}

export const getAllbuses = async(req, res) =>{
    try{
        const buses = await ScanData.find({}, {busNumber:1});
        const busCounts = Object.entries(
            buses.reduce((acc, bus) => {
              acc[bus.busNumber] = (acc[bus.busNumber] || 0) + 1;
              return acc;
            }, {})
          ).map(([busNumber, count]) => ({ busNumber: parseInt(busNumber), count }));
        res.status(200).json(busCounts);
    }catch(err){
        console.log(err);
    }
}

export const getstudbydata = async(req, res)=>{
    try{
        const {id} = req.params;
        const buses = await ScanData.find({busNumber:id}, {busNumber:1, rollNo:1, firstName:1, lastName:1});
        res.status(200).json(buses);
    }catch(err){
        console.log(err);
    }
}

export const filteredCities = async(req, res)=>{
    try{
        const {city} = req.body;
        const students = await Student.find({cityName:city});
        let arr=[]
        for(let i=0;i<students.length;i++){
            arr.push(students[i].rollno);
        }
        const buses = await ScanData.find({ rollNo: { $in: arr } }, {busNumber:1, _id:0});
        const busCounts = Object.entries(
            buses.reduce((acc, bus) => {
              acc[bus.busNumber] = (acc[bus.busNumber] || 0) + 1;
              return acc;
            }, {})
          ).map(([busNumber, count]) => ({ busNumber: parseInt(busNumber), count }));
        //   console.log(busCounts);
        res.status(200).json(busCounts);
    }catch(err){
        console.log(err);
    }
}
    
export const getTodayData = async (req,res) => {
  try {
    const result = await ScanData.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "rollNo",
          foreignField: "rollno",
          as: "studentDetails"
        }
      },
      { $unwind: "$studentDetails" },
      {
        $group: {
          _id: { busNumber: "$busNumber", city: "$studentDetails.cityName" },
          studentCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          busNumber: "$_id.busNumber",
          studentCount: 1,
          city: "$_id.city"
        }
      }
    ]);
    return res.status(200).send(result);
  } catch (error) {
    console.error("Error while aggregating data:", error);
    throw error;
  }
};

export const alloperators = async(req, res)=>{
    try{
        const operators = await Operator.find();
        res.status(200).json(operators);
    }catch(err){
        console.log(err);
    }
}

export const allStudents = async(req,res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.log(error)
    }
}

export const Unauthorized = async(req,res) => {
        try {
            const unauth = await Fraud.find().sort({ date: -1 });
            res.status(200).json(unauth);
        } catch (error) {
            console.log(error);
        }
}

export const UnauthCount = async(req,res) => {
    try {
        const count = await Fraud.find({date:Date.now()})
        res.status(200).json(count.length)
    } catch (error) {
        console.log(error);
    }
}