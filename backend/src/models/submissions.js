import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: { 
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ["pending", "running", "success", "error"], default: "pending" },
    output: { type: String },
    error: { type: String },
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
