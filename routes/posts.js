const express = require('express')
const Image = require('../models/Images')
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const { check, validationResult } = require('express-validator')
const dotenv = require('dotenv')
const auth = require('../middleware/auth')
dotenv.config()
const router = express.Router()
// @path /image
// @desc to upload image to cloudinary and save it to database
// @access private
router.post('/', [
    auth,
    upload.single('file')
],
    async (req, res) => {
        try {
            const filepath = req.file.path
            console.log(filepath);
            const result = await cloudinary.uploader.upload(filepath)
            res.send(result)
            const image = new Image({
                image_url: result.secure_url,
                image_id: result.public_id,
                user: req.user.id

            })
            await image.save()

        } catch (error) {
            console.log(error)
            return res.status(400).json({ errors: [{ msg: "Check your network connection" }] })
        }
    })

// @path /image
// @desc to delete image to cloudinary and  also delete from database
// @access private

router.delete('/delete/:id', auth, async (req, res) => {
    try {

        let data = await Image.findById(req.params.id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(data.image_id);
        // Delete user from db
        await data.remove();
        res.json(data);
    } catch (error) {
        // res.send(error)
        console.log(error)
    }
})

// @path /image
// @desc get image from database
// @access private

router.get('/', auth, async (req, res) => {
    try {
        const data = await Image.find({ user: req.user.id })
        res.json({ data })
    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = router