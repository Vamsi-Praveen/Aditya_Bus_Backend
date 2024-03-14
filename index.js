import bodyParser from "body-parser"
import cors from "cors"
import 'dotenv/config'
import express from "express"
import init from "./config/dbConfig.js"
import adminRouter from "./routes/admin.route.js"
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

//operator route
app.use('/api/v1/', operatorRouter)
//admin route
app.use('/api/v1/', adminRouter)


const PORT = process.env.PORT || 5000;

await init().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`)
    })
})