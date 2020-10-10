const express = require('express')
const app = express()
const cors = require('cors')

// Default Middleware
app.use(express.json())
app.use(cors())


// User Registration Route
const registrationRoute = require('./Routes/authRoute')
app.use('/', registrationRoute)

// User Post Route
const postRoute = require('./Routes/postRoute')
app.use('/', postRoute)

// User Post Route
const userRoute = require('./Routes/userRoutes')
app.use('/', userRoute)


// Database connection Process
const {DBConnection} = require('./DBConnection/dbConnection')
DBConnection()


const PORT = process.env.PORT || 3005
app.listen(PORT, () => console.log("Server is running on port "+PORT))