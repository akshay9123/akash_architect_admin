import mongoose from "mongoose";

const authModel = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    email:{
        type:String,
        required : true
    },
    password:{
        type : String,
        required : true
    }
})

const Auth = mongoose.model("Auth" , authModel)

export default Auth