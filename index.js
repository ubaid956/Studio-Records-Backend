import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cors from 'cors'

import audioRoutes from './router/audioRoutes.js';
import fileUpload from 'express-fileupload';

dotenv.config()

const app = express();
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))
app.use(express.json({ limit: "30mb", extended: true }));

app.get('/', (req, res)=>{
    res.status(200).json({message: "Hello There"})
})
// Routes
app.use("/api", audioRoutes);

const CONNECTION_URL = process.env.DATABASE_URL

// Starting the server
const PORT = process.env.PORT || 1000;
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server is Running: ${PORT}`)))
    .catch((error) => { console.log(error.message) })

