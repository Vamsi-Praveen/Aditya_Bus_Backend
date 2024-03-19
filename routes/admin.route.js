import express from "express"
import { delOp, getOperator, operatorRegistration } from "../controllers/operator.controller.js";
import {getTodayData, adminLogin, changeAdminPassword, getAdminDetails, getDetailsByRollNo, getstudbydata,getScanningCountByBus, logout, registerAdmin, getAllbuses, filteredCities, alloperators, allStudents, Unauthorized, UnauthCount } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/authVerify.js";
import { addStudent, deleteStudent } from "../controllers/student.controller.js";

const adminRouter = express.Router();

//operator registration
adminRouter.post('/op/register', verifyToken, operatorRegistration)

//admin login creation
adminRouter.post('/admin/register', verifyToken, registerAdmin);

//admin login 
adminRouter.post('/admin/login', adminLogin)

//admin Details
adminRouter.get('/admin/profile/:id',getAdminDetails);

//getting counts
adminRouter.get('/admin/getcount/', verifyToken, getScanningCountByBus)


//addStudent
adminRouter.post('/admin/addstudent', verifyToken, addStudent)

//studentDetailsByRollNo
adminRouter.get('/admin/getstudetails/:id', verifyToken, getDetailsByRollNo);

//deleteStudent
adminRouter.delete('/admin/deletestudent/:id', verifyToken, deleteStudent)

adminRouter.get('/admin/logout', verifyToken, logout);

adminRouter.get('/op/getOp/:id', getOperator);

adminRouter.delete('/op/delOp/:id', delOp);

adminRouter.post('/admin/changePass', changeAdminPassword);

adminRouter.get('/admin/allbuses', verifyToken, getAllbuses);

adminRouter.get('/admin/stdbybus/:id', verifyToken, getstudbydata);

adminRouter.post('/admin/filtercities', verifyToken, filteredCities);

adminRouter.get('/admin/getTodayData', verifyToken, getTodayData);

adminRouter.get('/admin/alloperators', verifyToken, alloperators);

adminRouter.get('/admin/allStudents',verifyToken,allStudents);

adminRouter.get('/admin/unauthorized',verifyToken, Unauthorized);

adminRouter.get('/admin/unauthCount',verifyToken, UnauthCount);

export default adminRouter;