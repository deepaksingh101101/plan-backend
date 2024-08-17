import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectToMongo } from './database/database.js';
import userRouter from './routes/userRoutes.js';


dotenv.config()

const app=express();

app.use(cors({origin:'*'}))
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 

connectToMongo();

app.get('/',(req,res)=>{
    res.send("Testing Vercel")
    })

// app.use(fileUpload({
//     useTempFiles : false
// }));



app.use("/api/user",userRouter)


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})







