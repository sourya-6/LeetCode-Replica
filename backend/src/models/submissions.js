import mongoose,{Schema} from "mongoose";

const submissionSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User",
         required: true 
        },
    code:{
        type:String,
        required:true
    },
    

},{timestamps:true})