import mongoose from "mongoose";

const init = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL)
        .then(() => {
            console.log('DB connected Succesfully')
        })
        .catch((err) => {
            console.log(err)
            return false
        })
}

export default init