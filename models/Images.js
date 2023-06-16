const mongoose = require('mongoose')
const { Schema, model } = mongoose

const image = new Schema({

    image_url: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = new model('image', image)