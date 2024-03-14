import express from "express"
import { operatorRegistration } from "../controllers/operator.controller.js";
import { adminLogin, getDetailsByRollNo, getScanningCountByBus, registerAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/authVerify.js";
import { addStudent, deleteStudent } from "../controllers/student.controller.js";

const adminRouter = express.Router();

//operator registration
adminRouter.post('/op/register', verifyToken, operatorRegistration)

//admin login creation

adminRouter.post('/admin/register', verifyToken, registerAdmin);

//admin login 
adminRouter.post('/admin/login', adminLogin)

//getting counts
adminRouter.get('/admin/getcount/', verifyToken, getScanningCountByBus)

//studentDetailsByRollNo
adminRouter.post('/admin/getstudetails', verifyToken, getDetailsByRollNo);

//addStudent
adminRouter.post('/admin/addstudent', verifyToken, addStudent)

//deleteStudent
adminRouter.post('/admin/deletestudent', verifyToken, deleteStudent)


export default adminRouter;