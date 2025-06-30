import mongoose from "mongoose";

const contactQuery = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required :true
    },
    phone:{
        type: String,
        required : true,
    },
    message:{
        type: String
    },
    status:{
        type: String,
        default: 'unresolved',
        enum: ["unresolved", "resolved"]
    },
    date:{
        type: Date,
        default : Date.now()  // Automatically sets current date
    },
},
{
    timestamps: true  // Automatically adds createdAt and updatedAt fields
}
)

const ContactQuery = mongoose.model("ContactQuery", contactQuery)

export default ContactQuery