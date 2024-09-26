
import multer from "multer";

// Use memory storage, so files are stored in memory as a buffer
const storage = multer.memoryStorage();

// File filter to allow only specific file types
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/mp3") {
//         req.fileValidationError = "File type must be audio/mp3 or audio/mpeg";
//         return cb(new Error(req.fileValidationError), false); // Reject invalid file types
//     } else {
//         cb(null, true); // Accept valid file types
//     }
// };
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4"];
    
    if (!allowedMimeTypes.includes(file.mimetype)) {
        req.fileValidationError = "File type must be audio/mp3, audio/mpeg, audio/wav, audio/ogg, or audio/m4a";
        return cb(new Error(req.fileValidationError), false);
    } else {
        cb(null, true); // Accept valid file types
    }
};



// Multer setup with limits and storage configuration
const effect = multer({
    storage, // Use in-memory storage
    fileFilter, // Use the file filter to validate audio files
    // limits: { fileSize: 10 * 1024 * 1024 } // Set a file size limit of 10MB
}).single("audio"); // Single file upload for the 'audio' field

export default effect;
