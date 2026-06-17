import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import contactRouter from './routes/contactRoute.js'



//app config
const app= express()
const port =process.env.PORT || 4000
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)

if (allowedOrigins.length === 0) {
    throw new Error('CORS origins are missing. Add FRONTEND_URL and ADMIN_URL to the backend environment.')
}

//middlewares
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}))

//api end point
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/contact',contactRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
}
)

const startServer = async () => {
    try {
        await connectDB()
        await connectcloudinary()

        app.listen(port,()=>console.log("server started",port))
    } catch (error) {
        console.error('Server startup failed:', error.message)
        process.exit(1)
    }
}

startServer()
