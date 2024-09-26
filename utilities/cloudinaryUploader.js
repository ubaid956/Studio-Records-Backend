import cloudinary from './cloudinary.js'
// const cloudinaryUploader = async (req, res) => {

//     const file = req.file
//     if (!file) {
//         return res.status(400).json({ message: "File Not Found" })
//     }
//     const fName = file.originalname.split(".")[0]

//     try {
//         const uploadAudio = await cloudinary.uploader.upload(file.path,{
//             resource_type: "raw",
//             public_id: `audioTutorial/${fName}`
//         })
//         return uploadAudio
        
//     }
//     catch(error){
//         console.log(error)
//         return res.status(400).json({message: error.message}  )
//     }
// }
const cloudinaryUploader = async (req) => { // No `res` here
    const file = req.file;
    if (!file) {
        throw new Error("File Not Found");
    }

    const fName = file.originalname.split(".")[0];

    try {
        const uploadAudio = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw", // Using raw for audio
            public_id: `audioTutorial/${fName}`
        });
        return uploadAudio;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default cloudinaryUploader;


