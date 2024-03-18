import express from "express"
import { checkStudent, getScannedBusDetails, getTodayBus, getValidBus, operatorLogin } from "../controllers/operator.controller.js"
import { verifyToken } from "../middlewares/authVerify.js"

const operatorRouter = express.Router()

//login
operatorRouter.post('/op/login', operatorLogin)
//checking students
operatorRouter.post('/op/check', verifyToken, checkStudent)
//checking valid bus
operatorRouter.get('/op/validBus/:bus', verifyToken, getValidBus)

operatorRouter.post('/op/getScanData', verifyToken, getScannedBusDetails)

operatorRouter.get('/op/getTodayBus/:date/:operator', verifyToken, getTodayBus)

export default operatorRouter
