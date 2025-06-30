import mongoose from "mongoose";

const dbConn = async() =>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected Successfully")
    } catch (error) {
        console.log("There is an issue while Connection")
    }
}

export default dbConn