import express from "express"
import { checkStudent, operatorLogin, operatorRegistration } from "../controllers/operator.controller.js"

const operatorRouter = express.Router()

//login
operatorRouter.post('/op/login', operatorLogin)
//registration
operatorRouter.post('/op/resgiter', operatorRegistration)
//checking students
operatorRouter.post('/op/check', checkStudent)

export default operatorRouter
