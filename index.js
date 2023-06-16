const express = require('express')
const cors = require('cors')
const userRegistration = require('./routes/UserRegistration')
const auth = require('./routes/auth')
const image = require('./routes/posts')
const connection = require('./connection')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000
// connect to db
connection()

// middlewares
app.use(express.json())
app.use(cors())
//-------------

// endpoint routes 
app.use('/user', userRegistration)
app.use('/auth', auth)
app.use('/image', image)

// port for running the app
app.listen(port, (req, res) => {
    console.log(`your server is running on port ${port}`)
})