const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const connectionurl = process.env.MONGODBURI
const connection = async () => {
    try {
        await mongoose.connect(connectionurl, {
            dbName: 'image_gallery',
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('connected to mongo db')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection