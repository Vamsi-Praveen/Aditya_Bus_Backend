import express from "express"
import 'dotenv/config'
import cors from "cors"
import bodyParser from "body-parser"
import init from "./config/dbConfig.js"
import { verifyToken } from "./middlewares/authVerify.js"
import operatorRouter from "./routes/operator.route.js"

const app = express()

app.use(cors({
    exposedHeaders: ['Authorization']
}))
app.use(bodyParser.json())


//testing get route
app.get('/api/v1/', async (req, res) => {
    return res.status(200).send('API is Up and Running 🚀');
})

//routes

app.use('/api/v1/', verifyToken, operatorRouter)


const PORT = process.env.PORT || 5000;

await init().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    })
})