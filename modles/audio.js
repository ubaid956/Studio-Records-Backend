import mongoose from "mongoose";

const audio = mongoose.Schema({
    audioUrl:{
        type: String,
        required: true
    }
}, { timestamps: true }
)
const Audio = mongoose.model('Audio', audio)
export default Audio