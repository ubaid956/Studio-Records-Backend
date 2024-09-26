
import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        let fileExt = file.originalname.split(".").pop();
        const fileName = `${new Date().getTime()}.${fileExt}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    // if (file.mimetype !== "audio/mpeg" && file.mimetype !== "audio/mp3") {
    //     req.fileValidationError = "File type must be audio/mp3 or audio/mpeg";
    //     return cb(new Error(req.fileValidationError), false);
    // } else {
    //     cb(null, true);
    // }
 
 
    const allowedMimeTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        req.fileValidationError = "File type must be audio/mp3, audio/mpeg, audio/wav, audio/ogg, or audio/m4a";
        return cb(new Error(req.fileValidationError), false);
    } else {
        cb(null, true); // Accept valid file types
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}).single("audio");

export default upload;


