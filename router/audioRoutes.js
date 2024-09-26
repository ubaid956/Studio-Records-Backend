// import express from 'express'
// import upload from '../utilities/multer.js';
// import { uploadAudio } from '../Controller/audio.js';
// const audioRoutes = express.Router();

// // Define the route for uploading audio
// audioRoutes.post("/uploadRecording",upload, uploadAudio);
// export default audioRoutes

import express from 'express';
import upload from '../utilities/multer.js'; // Multer for handling file uploads
// import { uploadAudio, getAllAudio, applyEffect } from '../Controller/audio.js';


import { addRecording,getAllRecording,applyEffect, delRecording } from '../Controller/audioController.js';
import effect from '../utilities/effectUpload.js';

const audioRoutes = express.Router();

// Define the route for uploading audio
// audioRoutes.post("/uploadRecording", upload, uploadAudio);
audioRoutes.post("/uploadRecording", addRecording)

// Define the route to get all audio files
audioRoutes.get("/Recordings", getAllRecording);
// Define the route for applying an effect to uploaded audio
// audioRoutes.post("/effect", effect, applyEffect);

audioRoutes.post("/effect",applyEffect )
audioRoutes.delete('/:id', delRecording)
export default audioRoutes;

