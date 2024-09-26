import Audio from "../modles/audio.js";
import { v2 as cloudinaryV2 } from 'cloudinary';
import ffmpeg from "fluent-ffmpeg";



import fs from 'fs';

// import { writeFile, unlink, stat } from 'fs/promises';
import { writeFile, stat, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
// import { cloudinaryV2 } from 'cloudinary';


// const writeFile = promisify(fs.writeFile);
// const unlink = promisify(fs.unlink);

cloudinaryV2.config({
    cloud_name: 'ddaebdx3n',
    api_key: '934264498649928',
    api_secret: 'jC_JZ60XVJ5MziXTuCVhCyp06Jw'
});

const pitchShiftAmounts = {
    guitar: -15,
    nadaswaram: 34.648,
    violin: -7,
    saxophone: 20,
    flute: 25,
    banjo: 12.5,
    drums: -25,
};

export const getAllRecording = async (req, res) => {
    try {
        const allRecording = await Audio.find();
        res.status(200).json(allRecording);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const addRecording = async (req, res) => {
    const file = req.files ? req.files.audio : null;  // retrieve the audio file

    try {
        console.log("Received file:", file); // Log the file object

        if (!file) {
            console.error("No file received:", req.files);
            return res.status(400).json({ message: "Audio file is required" });
        }

        console.log("Temp file path:", file.tempFilePath); // Log the temp file path

        // Upload the audio file to Cloudinary or other storage service
        const result = await cloudinaryV2.uploader.upload(file.tempFilePath, {
            resource_type: "video",  // Specify resource type to handle audio
        });

        // Save the recording to the database
        const newRecording = await Audio.create({
            audioUrl: result.url,
        });

        return res.status(200).json(newRecording);

    } catch (error) {
        console.error("Error uploading audio or saving recording:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const delRecording = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Find the recording by ID and delete it
        const findRecording = await Audio.findByIdAndDelete(id);

        // If the recording is not found, return a 404 error
        if (!findRecording) {
            return res.status(404).json({ message: 'Recording Not Found' });
        }

        // Return a success message with a 200 status
        res.status(200).json({ message: 'Recording Deleted Successfully', recording: findRecording });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error deleting recording:", error);

        // Return a 500 status for server errors
        res.status(500).json({ message: "Error deleting recording" });
    }
};


// export const applyEffect = async (req, res) => {
//     const file = req.files ? req.files.audio : null; // Retrieve the audio file
//     const { instrument } = req.body;

//     try {
//         console.log("Received file:", file); // Log the file object

//         if (!file || !file.buffer) {
//             console.error("No audio file uploaded:", req.files);
//             return res.status(400).json({ message: "No audio file uploaded" });
//         }

//         if (!instrument || !pitchShiftAmounts.hasOwnProperty(instrument)) {
//             console.error("Invalid or missing instrument:", instrument);
//             return res.status(400).json({ message: "Invalid or missing instrument" });
//         }

//         console.log("Instrument selected:", instrument);
//         const pitchShiftAmount = pitchShiftAmounts[instrument];
//         const tempInputFile = path.join(tmpdir(), `input_${Date.now()}.mp3`);
//         const tempOutputFile = path.join(tmpdir(), `output_${Date.now()}.mp3`);

//         // Write the uploaded file to a temporary location
//         await writeFile(tempInputFile, file.buffer);

//         ffmpeg(tempInputFile)
//             .audioFilters(`asetrate=44100*2^(${pitchShiftAmount}/12),aresample=44100`)
//             .on('end', async () => {
//                 try {
//                     const outputBuffer = await fs.promises.readFile(tempOutputFile);
//                     await unlink(tempInputFile);
//                     await unlink(tempOutputFile);

//                     // Optionally, upload to Cloudinary
//                     const result = await cloudinaryV2.uploader.upload(tempOutputFile, {
//                         resource_type: "video",  // Specify resource type to handle audio
//                     });

//                     // Save the modified audio effect to the database
//                     // const newRecording = await Audio.create({
//                     //     audioUrl: result.url,
//                     // });

//                     res.set('Content-Type', 'audio/mpeg');
//                     return res.status(200).json(result.url);
//                 } catch (error) {
//                     console.error("Error reading output file:", error);
//                     return res.status(500).json({ message: "Error reading output file" });
//                 }
//             })
//             .on('error', (error) => {
//                 console.error("FFmpeg error:", error);
//                 return res.status(500).json({ message: "Error applying effect" });
//             })
//             .save(tempOutputFile);
//     } catch (error) {
//         console.error("Error processing audio:", error);
//         return res.status(500).json({ message: error.message });
//     }
// };


// export const applyEffect = async (req, res) => {
//     const file = req.files ? req.files.audio : null;
//     const { instrument } = req.body;

//     try {
//         console.log("Received file:", file);

//         if (!file || !file.data) {
//             console.error("No audio file uploaded:", req.files);
//             return res.status(400).json({ message: "No audio file uploaded" });
//         }

//         if (!instrument || !pitchShiftAmounts.hasOwnProperty(instrument)) {
//             console.error("Invalid or missing instrument:", instrument);
//             return res.status(400).json({ message: "Invalid or missing instrument" });
//         }

//         console.log("Instrument selected:", instrument);
//         const pitchShiftAmount = pitchShiftAmounts[instrument];

//         // Save the uploaded file with its original extension
//         const tempInputFile = path.join(tmpdir(), `input_${Date.now()}.mp3`);
//         const tempOutputFile = path.join(tmpdir(), `output_${Date.now()}.mp3`);

//         // Move the uploaded file to a temporary location using file.mv()
//         await new Promise((resolve, reject) => {
//             file.mv(tempInputFile, (err) => {
//                 if (err) {
//                     console.error("Error moving file:", err);
//                     return reject(err);
//                 }
//                 resolve();
//             });
//         });

//         // Check if the file has been properly written
//         const fileStat = await stat(tempInputFile);
//         console.log("Temporary input file size:", fileStat.size);

//         if (fileStat.size === 0) {
//             console.error("File is empty or not written properly");
//             return res.status(500).json({ message: "File not written properly" });
//         }

//         // Process with FFmpeg
//         ffmpeg(tempInputFile)
//             .audioFilters(`asetrate=44100*2^(${pitchShiftAmount}/12),aresample=44100`)
//             .on('end', async () => {
//                 try {
//                     const outputBuffer = await fs.promises.readFile(tempOutputFile);

//                     // Optionally upload the processed file to Cloudinary
//                     const result = await cloudinaryV2.uploader.upload(tempOutputFile, {
//                         resource_type: "video",
//                     });

//                     // Clean up temporary files
//                     await unlink(tempInputFile);
//                     await unlink(tempOutputFile);

//                     // Send the Cloudinary URL or audio buffer as response
//                     res.set('Content-Type', 'audio/mpeg');
//                     return res.status(200).json({ url: result.url });
//                 } catch (error) {
//                     console.error("Error reading output file:", error);
//                     return res.status(500).json({ message: "Error reading output file" });
//                 }
//             })
//             .on('error', (error) => {
//                 console.error("FFmpeg error:", error);
//                 return res.status(500).json({ message: "Error applying effect" });
//             })
//             .save(tempOutputFile);
//     } catch (error) {
//         console.error("Error processing audio:", error);
//         return res.status(500).json({ message: error.message });
//     }
// };


export const applyEffect = async (req, res) => {
    const file = req.files ? req.files.audio : null;
    const { instrument } = req.body;

    try {
        console.log("Received file:", file);

        if (!file || !file.data) {
            console.error("No audio file uploaded:", req.files);
            return res.status(400).json({ message: "No audio file uploaded" });
        }

        if (!instrument || !pitchShiftAmounts.hasOwnProperty(instrument)) {
            console.error("Invalid or missing instrument:", instrument);
            return res.status(400).json({ message: "Invalid or missing instrument" });
        }

        console.log("Instrument selected:", instrument);
        const pitchShiftAmount = pitchShiftAmounts[instrument];

        // Save the uploaded file with its original extension
        const tempInputFile = path.join(tmpdir(), `input_${Date.now()}.mp3`);
        const tempOutputFile = path.join(tmpdir(), `output_${Date.now()}.mp3`);

        // Move the uploaded file to a temporary location using file.mv()
        await new Promise((resolve, reject) => {
            file.mv(tempInputFile, (err) => {
                if (err) {
                    console.error("Error moving file:", err);
                    return reject(err);
                }
                resolve();
            });
        });

        // Check if the file has been properly written
        const fileStat = await stat(tempInputFile);
        console.log("Temporary input file size:", fileStat.size);

        if (fileStat.size === 0) {
            console.error("File is empty or not written properly");
            return res.status(500).json({ message: "File not written properly" });
        }

        // Process with FFmpeg
        ffmpeg(tempInputFile)
            .audioFilters(`asetrate=44100*2^(${pitchShiftAmount}/12),aresample=44100`)
            .on('end', async () => {
                try {
                    const outputBuffer = await fs.promises.readFile(tempOutputFile);

                    // Option 1: Send the audio buffer directly as response
                    res.set('Content-Type', 'audio/mpeg');
                    res.send(outputBuffer);

                    // Option 2: Upload the processed file to Cloudinary and send URL (uncomment if needed)
                    /*
                    const result = await cloudinaryV2.uploader.upload(tempOutputFile, {
                        resource_type: "video",
                    });

                    // Send Cloudinary URL as JSON response
                    return res.status(200).json({ url: result.url });
                    */

                    // Clean up temporary files
                    await unlink(tempInputFile);
                    await unlink(tempOutputFile);
                } catch (error) {
                    console.error("Error reading output file:", error);
                    return res.status(500).json({ message: "Error reading output file" });
                }
            })
            .on('error', (error) => {
                console.error("FFmpeg error:", error);
                return res.status(500).json({ message: "Error applying effect" });
            })
            .save(tempOutputFile);
    } catch (error) {
        console.error("Error processing audio:", error);
        return res.status(500).json({ message: error.message });
    }
};

